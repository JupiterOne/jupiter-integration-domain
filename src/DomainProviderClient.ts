import { retry } from "@lifeomic/attempt";
import whois from "whois-api";

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
      },
    );
  }
}
