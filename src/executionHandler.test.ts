import { IntegrationExecutionContext } from "@jupiterone/jupiter-managed-integration-sdk";
import executionHandler from "./executionHandler";
import initializeContext from "./initializeContext";
import { DOMAIN_ENTITY_TYPE } from "./types";

jest.mock("./initializeContext");

test("executionHandler", async () => {
  const executionContext: any = {
    graph: {
      findEntitiesByType: jest.fn().mockResolvedValue([]),
    },
    persister: {
      processEntities: jest.fn().mockReturnValue([]),
      processRelationships: jest.fn().mockReturnValue([]),
      publishPersisterOperations: jest.fn().mockResolvedValue({}),
    },
    provider: {
      fetch: jest.fn().mockResolvedValue({}),
      fetchDomainDetails: jest.fn().mockResolvedValue([]),
    },
  };

  (initializeContext as jest.Mock).mockReturnValue(executionContext);

  const invocationContext = {
    instance: {
      config: {
        domains: "hello.com,test.com, test1.com,test2.com",
      },
    },
  } as IntegrationExecutionContext;
  await executionHandler(invocationContext);

  expect(initializeContext).toHaveBeenCalledWith(invocationContext);

  expect(executionContext.graph.findEntitiesByType).toHaveBeenCalledWith(
    DOMAIN_ENTITY_TYPE,
  );

  expect(executionContext.provider.fetchDomainDetails).toHaveBeenCalledTimes(4);

  expect(executionContext.persister.processEntities).toHaveBeenCalledTimes(1);
  expect(
    executionContext.persister.publishPersisterOperations,
  ).toHaveBeenCalledTimes(1);
});
