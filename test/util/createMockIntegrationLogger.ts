import { IntegrationLogger } from "@jupiterone/jupiter-managed-integration-sdk";

export default function createMockIntegrationLogger(): IntegrationLogger {
  return {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    child: jest.fn(),
  };
}
