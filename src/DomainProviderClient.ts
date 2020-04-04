import { retry } from "@lifeomic/attempt";
import whois, { WhoisLookupDomain } from "whois-api";

export interface Domain extends WhoisLookupDomain {
  name: string;
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
              ...result,
              name: domainName
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
