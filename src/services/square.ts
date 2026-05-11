import { SquareClient, SquareEnvironment } from 'square';
import { getConfig } from '../lib/config';

export function getSquareClient(tokenOverride?: string): SquareClient {
  const accessToken = tokenOverride || process.env.SQUARE_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('SQUARE_ACCESS_TOKEN environment variable is required. Please add it to the Secrets menu in Settings or the Setup Wizard.');
  }
  
  const envString = process.env.SQUARE_ENVIRONMENT || getConfig('SQUARE_ENVIRONMENT') || 'sandbox';
  return new SquareClient({
    token: accessToken,
    environment: envString === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
  });
}

export const getSquareLocationId = (override?: string) => 
  override || process.env.SQUARE_LOCATION_ID || process.env.VITE_SQUARE_LOCATION_ID;
