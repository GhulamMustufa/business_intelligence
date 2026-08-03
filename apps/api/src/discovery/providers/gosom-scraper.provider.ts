import { IDiscoveryProvider } from './discovery-provider.interface';
import { DiscoveredBusiness } from '../interfaces/discovered-business.interface';
import { Logger } from '@nestjs/common';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

export class GosomScraperProvider implements IDiscoveryProvider {
  private readonly logger = new Logger(GosomScraperProvider.name);
  private readonly apiUrl = process.env.GOSOM_API_URL || 'http://localhost:8081';

  async discover(query: string, location: string, industry: string): Promise<DiscoveredBusiness[]> {
    const searchQuery = `${industry} in ${location} ${query}`.trim();
    this.logger.log(`Starting Gosom scraper job for query: ${searchQuery}`);

    try {
      // 1. Create the job
      const createResponse = await fetch(`${this.apiUrl}/api/v1/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queries: [searchQuery],
          depth: 40, // Scrape up to 40 results per query
          email: true,
          language: 'en',
        }),
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create job: ${createResponse.statusText}`);
      }

      const createData = await createResponse.json();
      const jobId = createData.id;
      
      this.logger.log(`Job created successfully. ID: ${jobId}. Polling for completion...`);

      // 2. Poll until finished
      let isCompleted = false;
      let attempts = 0;
      const maxAttempts = 30; // 30 * 2 seconds = 60 seconds

      while (!isCompleted && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;

        const statusResponse = await fetch(`${this.apiUrl}/api/v1/jobs/${jobId}`);
        if (!statusResponse.ok) continue;

        const statusData = await statusResponse.json();
        this.logger.debug(`Job ${jobId} status: ${statusData.status}`);

        if (statusData.status === 'completed' || statusData.status === 'finished' || statusData.status === 'success') {
          isCompleted = true;
        } else if (statusData.status === 'failed' || statusData.status === 'error') {
          throw new Error(`Scraper job failed: ${statusData.error}`);
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
              reviewsCount: data.reviews ? parseInt(data.reviews, 10) : undefined,
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
