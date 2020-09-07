import { IntegrationConfig } from '../src/types';

export function getMockIntegrationConfig(): IntegrationConfig {
  return {
    domains: process.env.DOMAINS || 'google.com,facebook.com',
  };
}
