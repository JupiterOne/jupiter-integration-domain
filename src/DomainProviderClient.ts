import { retry } from "@lifeomic/attempt";
import whois, { WhoisLookupDomain } from "whois-api";
import { IntegrationLogger } from "@jupiterone/jupiter-managed-integration-sdk";

export interface Domain extends WhoisLookupDomain {
  name: string;
}

export default class DomainProviderClient {
  constructor(readonly logger: IntegrationLogger) {}

  public async fetchDomainDetails(domainName: string): Promise<Domain> {
    return retry<Domain>(
      () => {
        return new Promise<Domain>((resolve, reject) => {
          whois.lookup(domainName, (err, result) => {
            if (err) {
              return reject(err);
            }

            resolve({
              ...result,
              name: domainName,
            });
          });
        });
      },
      {
        delay: 500,
        maxAttempts: 3,
        handleError: (err, attemptContext) => {
          if (attemptContext.attemptsRemaining > 0) {
            this.logger.warn(
              {
                err,
                attemptsRemaining: attemptContext.attemptsRemaining,
                attemptNum: attemptContext.attemptNum,
              },
              "Error fetching domain details, but it will be retried.",
            );
          } else {
            this.logger.error(
              {
                err,
              },
              "Maximum retries exceeded for fetching domain details",
            );
          }
        },
      },
    );
  }
}
