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

export interface WhoisLookupDomain {
  id: string;
  updated_date: string;
  creation_date: string;
  expiration_date: string;
  whois_server: string;
  registrar: string;
  emails: string | string[];
  status: string;
  nameservers: string | string[];
  contact: {
    registrant: object;
    technical: object;
    admin: object;
    billing: object;
  };
}
