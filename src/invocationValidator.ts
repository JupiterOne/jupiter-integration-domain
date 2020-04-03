import {
  IntegrationInstanceConfigError,
  IntegrationValidationContext,
} from "@jupiterone/jupiter-managed-integration-sdk";
import isValidDomain from "is-valid-domain";
import { getDomainListFromConfigParam } from "./util/getDomainListFromConfigParam";

/**
 * Performs validation of the execution before the execution handler function is
 * invoked.
 *
 * At a minimum, integrations should ensure that the
 * `context.instance.config` is valid. Integrations that require
 * additional information in `context.invocationArgs` should also
 * validate those properties. It is also helpful to perform authentication with
 * the provider to ensure that credentials are valid.
 *
 * The function will be awaited to support connecting to the provider for this
 * purpose.
 *
 * @param context
 */
export default async function invocationValidator(
  context: IntegrationValidationContext,
): Promise<void> {
  const {
    instance: { config },
  } = context;

  if (!config.domains) {
    throw new IntegrationInstanceConfigError(
      "config.domains must be provided by the user",
    );
  }

  const domains = getDomainListFromConfigParam(config.domains);

  for (const domain of domains) {
    if (!isValidDomain(domain)) {
      throw new IntegrationInstanceConfigError(`Invalid domain name ${domain}`);
    }
  }

  return Promise.resolve();
}
