import { retry } from "@lifeomic/attempt";
import whois from "whois-api";
import { IntegrationLogger } from '@jupiterone/jupiter-managed-integration-sdk';

export interface Domain {
  name: string;
  updatedDate: string;
  creationDate: string;
  expirationDate: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Device {
  id: string;
  manufacturer: string;
  ownerId: string;
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
              name: domainName,
              updatedDate: result.updated_date,
              creationDate: result.creation_date,
              expirationDate: result.expiration_date,
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
              'Error fetching domain details, but it will be retried.'
            );
          } else {
            this.logger.error({
              err
            }, 'Maximum retries exceeded for fetching domain details');
          }
        },
      }
    );
  }
}
