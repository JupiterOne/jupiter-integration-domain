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
  id: string;
  name: string;
  domainName: string;
  expiresOn?: number;
  updatedOn?: number;
  createdOn?: number;
  whoisServer?: string;
  registrar?: string;
  status?: string;
  contactEmails?: string | string[];
  nameservers?: string | string[];
  abuseContactEmail?: string;
  registrantContactEmail?: string;
  techContactEmail?: string;
  adminContactEmail?: string;
  billingContactEmail?: string;
}

export interface ExecutionContext extends IntegrationExecutionContext {
  graph: GraphClient;
  persister: PersisterClient;
  provider: DomainProviderClient;
}
