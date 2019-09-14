import {
  IntegrationExecutionContext,
  IntegrationExecutionResult,
} from "@jupiterone/jupiter-managed-integration-sdk";
import { createDomainEntity } from "./converters";
import DomainProviderClient, { Domain } from "./DomainProviderClient";
import initializeContext from "./initializeContext";
import { DOMAIN_ENTITY_TYPE, DomainEntity } from "./types";
import { getDomainListFromConfigParam } from "./util/getDomainListFromConfigParam";

export default async function executionHandler(
  context: IntegrationExecutionContext,
): Promise<IntegrationExecutionResult> {
  const { graph, persister, provider } = initializeContext(context);
  const domains = getDomainListFromConfigParam(context.instance.config.domains);

  const [oldDomainEntities, newDomainEntities] = await Promise.all([
    graph.findEntitiesByType<DomainEntity>(DOMAIN_ENTITY_TYPE),
    fetchDomainEntitiesFromProvider(domains, provider),
  ]);

  return {
    operations: await persister.publishPersisterOperations([
      [...persister.processEntities(oldDomainEntities, newDomainEntities)],
      [],
    ]),
  };
}

async function fetchDomainEntitiesFromProvider(
  domains: string[],
  provider: DomainProviderClient,
): Promise<DomainEntity[]> {
  const promises: Array<Promise<Domain>> = [];

  for (const domain of domains) {
    promises.push(provider.fetchDomainDetails(domain));
  }

  const result = await Promise.all(promises);
  return result.map(domain => createDomainEntity(domain));
}
