import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  // Get the discovery provider directly
  const discoveryProvider = app.get('DISCOVERY_PROVIDER');
  
  console.log('Testing Discovery Provider (Gosom Scraper)...');
  
  try {
    const results = await discoveryProvider.searchBusinesses('clinics in malaysia', undefined);
    console.log(`Successfully extracted ${results.length} results!`);
    console.log(JSON.stringify(results.slice(0, 2), null, 2));
  } catch (err) {
    console.error('Test Failed:', err);
  } finally {
    await app.close();
  }
}

bootstrap();
