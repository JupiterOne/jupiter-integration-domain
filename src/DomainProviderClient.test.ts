import whois, { WhoisLookupDomain } from "whois-api";
import DomainProviderClient, { Domain } from "./DomainProviderClient";
import createMockIntegrationLogger from "../test/util/createMockIntegrationLogger";

jest.mock("whois-api");

const mockWhois = whois as jest.Mocked<{
  lookup: (
    domain: string,
    cb: (err: Error | null, result?: WhoisLookupDomain) => void,
  ) => void;
}>;

let client: DomainProviderClient;

beforeEach(() => {
  client = new DomainProviderClient(createMockIntegrationLogger());
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("fetchDomainDetails", () => {
  test("should allow fetching domain information", async () => {
    mockWhois.lookup.mockImplementationOnce((domain, cb) => {
      cb(null, {
        updated_date: "2019-09-09T15:39:04Z",
        creation_date: "1997-09-15T04:00:00Z",
        expiration_date: "2028-09-14T04:00:00Z",
      });
    });

    const expectedDomain: Domain = {
      name: "google.com",
      creationDate: expect.any(String),
      updatedDate: expect.any(String),
      expirationDate: expect.any(String),
    };

    expect(await client.fetchDomainDetails("google.com")).toEqual(
      expectedDomain,
    );
  });

  test("should retry when domain detail fetching fails", async () => {
    mockWhois.lookup
      .mockImplementationOnce((domain, cb) => {
        cb(new Error("expected error"));
      })
      .mockImplementationOnce((domain, cb) => {
        cb(null, {
          updated_date: "2019-09-09T15:39:04Z",
          creation_date: "1997-09-15T04:00:00Z",
          expiration_date: "2028-09-14T04:00:00Z",
        });
      });

    const expectedDomain: Domain = {
      name: "google.com",
      creationDate: expect.any(String),
      updatedDate: expect.any(String),
      expirationDate: expect.any(String),
    };

    expect(await client.fetchDomainDetails("google.com")).toEqual(
      expectedDomain,
    );
  });

  test("should reject if whois lookup rejects", async () => {
    mockWhois.lookup.mockImplementation((domain, cb) => {
      cb(new Error("expected error"));
    });

    await expect(client.fetchDomainDetails("google.com")).rejects.toThrowError(
      "expected error",
    );
  });
});
