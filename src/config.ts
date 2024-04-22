import {
  IntegrationExecutionContext,
  IntegrationInstanceConfig,
  IntegrationInstanceConfigFieldMap,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import isValidDomain from 'is-valid-domain';
import { getDomainListFromConfigParam } from './utils';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  domains: {
    type: 'string',
    mask: false,
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * Comma-delimited list of domain names
   *
   * (e.g. google.com,facebook.com)
   */
  domains: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const {
    instance: { config },
  } = context;

  if (!config.domains) {
    throw new IntegrationValidationError(
      'config.domains must be provided by the user',
    );
  }

  const domains = getDomainListFromConfigParam(config.domains);

  for (const domain of domains) {
    if (!isValidDomain(domain)) {
      throw new IntegrationValidationError(`Invalid domain name ${domain}`);
    }
  }

  return Promise.resolve();
}
