import { IntegrationStepExecutionContext } from '@jupiterone/integration-sdk-core';

export type IntegrationStepContext = IntegrationStepExecutionContext<
  IntegrationConfig
>;

export interface IntegrationConfig {
  /**
   * Comma-delimited list of domain names
   *
   * (e.g. google.com,facebook.com)
   */
  domains: string;
}
