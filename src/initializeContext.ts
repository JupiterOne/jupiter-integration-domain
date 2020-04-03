import { IntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";
import DomainProviderClient from "./DomainProviderClient";
import { ExecutionContext } from "./types";

export default function initializeContext(
  context: IntegrationExecutionContext,
): ExecutionContext {
  return {
    ...context,
    ...context.clients.getClients(),
    provider: new DomainProviderClient(),
  };
}
