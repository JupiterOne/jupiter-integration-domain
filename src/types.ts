import {
  EntityFromIntegration,
  GraphClient,
  IntegrationExecutionContext,
  PersisterClient,
} from "@jupiterone/jupiter-managed-integration-sdk";
import DomainProviderClient from "./DomainProviderClient";

export const DOMAIN_ENTITY_TYPE = "internet_domain";
export const DOMAIN_ENTITY_CLASS = "Domain";

export interface DomainEntity extends EntityFromIntegration {
  name: string;
  domainName: string;
  expiresOn?: number;
  updatedOn?: number;
  createdOn?: number;
}

export interface ExecutionContext extends IntegrationExecutionContext {
  graph: GraphClient;
  persister: PersisterClient;
  provider: DomainProviderClient;
}
