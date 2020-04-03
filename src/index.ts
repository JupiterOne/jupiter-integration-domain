import { IntegrationInvocationConfig } from "@jupiterone/jupiter-managed-integration-sdk";

import executionHandler from "./executionHandler";
import invocationValidator from "./invocationValidator";

const invocationConfig: IntegrationInvocationConfig = {
  instanceConfigFields: {
    /**
     * Comma separated list of domains (e.g. google.com,apple.com)
     */
    domains: {
      type: "string",
      mask: false,
    },
  },
  executionHandler,
  invocationValidator,
};

export default invocationConfig;
