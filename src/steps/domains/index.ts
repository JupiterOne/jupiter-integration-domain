import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import DomainProviderClient from '../../DomainProviderClient';
import { createDomainEntity } from './converters';
import { Entities, Steps } from '../../constants';
import { getDomainListFromConfigParam } from '../../utils';
import { IntegrationConfig } from '../../config';

export async function fetchDomains({
  instance,
  logger,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>): Promise<void> {
  const { domains } = instance.config;

  const client = new DomainProviderClient(logger);

  await client.iterateDomains(
    getDomainListFromConfigParam(domains),
    async (domain) => {
      await jobState.addEntity(createDomainEntity(domain));
    },
  );
}

export const domainSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DOMAIN,
    name: 'Fetch Domains',
    entities: [Entities.DOMAIN],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchDomains,
  },
];
