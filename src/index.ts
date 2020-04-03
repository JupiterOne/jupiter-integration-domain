import { IntegrationInvocationConfig } from "@jupiterone/jupiter-managed-integration-sdk";

import executionHandler from "./executionHandler";
import invocationValidator from "./invocationValidator";

export const invocationConfig: IntegrationInvocationConfig = {
  instanceConfigFields: {
    domains: {
      type: "array",
      mask: false,
    },
  },
  invocationValidator,
  integrationStepPhases: [
    {
      steps: [
        {
          id: "synchronize",
          name: "Synchronize",
          executionHandler,
        },
      ],
    },
  ],
};
