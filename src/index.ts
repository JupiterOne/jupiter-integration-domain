import {
  IntegrationInvocationConfig,
  IntegrationConfigLoadError,
  IntegrationExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from './types';
import DomainProviderClient, { Domain } from './DomainProviderClient';
import {
  createIntegrationEntity,
  getTime,
} from '@jupiterone/integration-sdk-core';
import isValidDomain from 'is-valid-domain';

export const ENTITY_DOMAIN_CLASS = 'Domain';
export const ENTITY_DOMAIN_TYPE = 'internet_domain';

function getDomainListFromConfigParam(
  domainConfig: string | string[],
): string[] {
  return typeof domainConfig === 'string'
    ? domainConfig
        .trim()
        .replace(/\s*,\s*/g, ',')
        .split(',')
    : domainConfig.map((d) => d.trim());
}

export function createDomainEntity(domain: Domain) {
  return createIntegrationEntity({
    entityData: {
      source: domain,
      assign: {
        _key: `internet_domain_${domain.name}`,
        _type: ENTITY_DOMAIN_TYPE,
        _class: ENTITY_DOMAIN_CLASS,
        id: domain.id,
        name: domain.name,
        displayName: domain.name,
        domainName: domain.name,
        expiresOn: getTime(domain.expiration_date),
        updatedOn: getTime(domain.updated_date),
        createdOn: getTime(domain.creation_date),
        whoisServer: domain.whois_server,
        registrar: domain.registrar,
        status: domain.status,
        contactEmails: Array.isArray(domain.emails)
          ? domain.emails
          : [domain.emails],
        nameservers: Array.isArray(domain.nameservers)
          ? domain.nameservers
          : [domain.nameservers],
      },
    },
  });
}

export async function fetchDomains(
  context: IntegrationStepContext,
): Promise<void> {
  const { instance, logger } = context;
  const { domains } = instance.config;

  const client = new DomainProviderClient(logger);

  await client.iterateDomains(
    getDomainListFromConfigParam(domains),
    async (domain) => {
      await context.jobState.addEntity(createDomainEntity(domain));
    },
  );
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const {
    instance: { config },
  } = context;

  if (!config.domains) {
    throw new IntegrationConfigLoadError(
      'config.domains must be provided by the user',
    );
  }

  const domains = getDomainListFromConfigParam(config.domains);

  for (const domain of domains) {
    if (!isValidDomain(domain)) {
      throw new IntegrationConfigLoadError(`Invalid domain name ${domain}`);
    }
  }

  return Promise.resolve();
}

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> = {
  instanceConfigFields: {
    domains: {
      type: 'array' as any,
      mask: false,
    },
  },
  validateInvocation,
  integrationSteps: [
    {
      id: 'step-fetch-domains',
      name: 'Domains',
      entities: [
        {
          resourceName: 'Domain',
          _type: ENTITY_DOMAIN_TYPE,
          _class: ENTITY_DOMAIN_CLASS,
        },
      ],
      relationships: [],
      executionHandler: fetchDomains,
    },
  ],
};
