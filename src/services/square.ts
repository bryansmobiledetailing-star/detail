import { SquareClient, SquareEnvironment } from 'square';

export function getSquareClient(tokenOverride?: string): SquareClient {
  const accessToken = tokenOverride || process.env.SQUARE_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('SQUARE_ACCESS_TOKEN environment variable is required. Please add it to the Secrets menu in Settings or the Setup Wizard.');
  }
  
  return new SquareClient({
    token: accessToken,
    environment: (process.env.SQUARE_ENVIRONMENT || 'sandbox') === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox,
  });
}

export const getSquareLocationId = (override?: string) => 
  override || process.env.SQUARE_LOCATION_ID || process.env.VITE_SQUARE_LOCATION_ID;
