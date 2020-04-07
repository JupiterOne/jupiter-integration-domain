import { retry } from "@lifeomic/attempt";
import whois, { WhoisLookupDomain } from "whois-api";
import { domainProperties } from "./constants";

test.skip("should fetching domain information", async () => {
  const domainName = "jupiterone.com";
  const result = await retry<WhoisLookupDomain>(
    () => {
      return new Promise<WhoisLookupDomain>((resolve, reject) => {
        whois.lookup(domainName, (err, res) => {
          if (err) {
            return reject(err);
          }
          resolve(res);
        });
      });
    },
    {
      delay: 500,
      maxAttempts: 3,
    },
  );
  expect(result).toEqual(domainProperties);
});
