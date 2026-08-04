import { IDiscoveryProvider, DiscoveredBusiness } from '../interfaces/discovery-provider.interface';
import { Logger } from '@nestjs/common';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

export class GosomScraperProvider implements IDiscoveryProvider {
  private readonly logger = new Logger(GosomScraperProvider.name);
  private readonly apiUrl = process.env.GOSOM_API_URL || 'http://localhost:8081';

  async searchBusinesses(query?: string, locations?: string[], industries?: string[]): Promise<DiscoveredBusiness[]> {
    const locStr = (locations?.join(' ') || '').trim();
    const indStr = (industries?.join(' ') || '').trim();
    const parts = [];
    if (indStr) parts.push(indStr);
    if (locStr) parts.push(`in ${locStr}`);
    if (query) parts.push(query);
    const searchQuery = parts.join(' ').trim();
    this.logger.log(`Starting Gosom scraper job for query: ${searchQuery}`);

    try {
      // 1. Create the job
      const createResponse = await fetch(`${this.apiUrl}/api/v1/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Discovery Search: ${searchQuery}`,
          keywords: [searchQuery],
          depth: 2,
          email: false,
          lang: 'en',
          max_time: 15,
        }),
      });

      if (!createResponse.ok) {
        const errText = await createResponse.text();
        this.logger.error(`Gosom rejection details: ${errText}`);
        throw new Error(`Failed to create job: ${createResponse.statusText}`);
      }

      const createData = await createResponse.json();
      const jobId = createData.id;
      
      this.logger.log(`Job created successfully. ID: ${jobId}. Polling for completion...`);

      // 2. Poll until finished
      let isCompleted = false;
      let attempts = 0;
      const maxAttempts = 90; // 90 * 2 seconds = 180 seconds

      while (!isCompleted && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;

        const statusResponse = await fetch(`${this.apiUrl}/api/v1/jobs/${jobId}`);
        if (!statusResponse.ok) continue;

        const statusData = await statusResponse.json();
        const currentStatus = (statusData.Status || statusData.status || '').toLowerCase();
        this.logger.debug(`Job ${jobId} status: ${currentStatus}`);

        if (currentStatus === 'completed' || currentStatus === 'finished' || currentStatus === 'success' || currentStatus === 'ok') {
          isCompleted = true;
        } else if (currentStatus === 'failed' || currentStatus === 'error') {
          throw new Error(`Scraper job failed: ${statusData.error || 'Unknown error'}`);
        }
      }

      if (!isCompleted) {
        throw new Error(`Scraper job ${jobId} timed out after 60 seconds.`);
      }

      // 3. Download results CSV
      this.logger.log(`Job ${jobId} completed. Downloading results...`);
      const downloadResponse = await fetch(`${this.apiUrl}/api/v1/jobs/${jobId}/download`);
      if (!downloadResponse.ok) {
        throw new Error(`Failed to download results: ${downloadResponse.statusText}`);
      }

      const csvText = await downloadResponse.text();
      const results = await this.parseCsv(csvText);
      
      this.logger.log(`Extracted ${results.length} businesses from Gosom scraper.`);
      return results;

    } catch (error) {
      this.logger.error(`Gosom scraper error:`, error);
      return []; // Fallback to empty array
    }
  }

  private parseCsv(csvText: string): Promise<DiscoveredBusiness[]> {
    return new Promise((resolve, reject) => {
      const results: DiscoveredBusiness[] = [];
      const stream = Readable.from(csvText);

      stream
        .pipe(csvParser())
        .on('data', (data: any) => {
          if (data.title) { // Assuming 'title' is the business name column
            results.push({
              name: data.title,
              website: data.website || data.link, // Fallbacks based on CSV headers
              location: data.address || data.city,
              industry: data.category,
              phone: data.phone,
              rating: data.rating ? parseFloat(data.rating) : undefined,
            });
          }
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error: any) => {
          reject(error);
        });
    });
  }
}
