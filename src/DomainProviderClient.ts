import { retry } from '@lifeomic/attempt';
import { IntegrationLogger } from '@jupiterone/integration-sdk-core';
import pMap from 'p-map';
import { WhoisLookupDomain } from './types';

const whois = require('whois-api');

export interface Domain extends WhoisLookupDomain {
  name: string;
}

export default class DomainProviderClient {
  constructor(readonly logger: IntegrationLogger) {}

  async fetchDomainDetails(domainName: string): Promise<Domain> {
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
              'Error fetching domain details, but it will be retried.',
            );
          }
        },
      },
    );
  }

  async iterateDomains(
    domainNames: string[],
    callback: (domain: Domain) => Promise<void>,
  ) {
    const domainsFailed: string[] = [];

    await pMap(
      domainNames,
      async (domainName) => {
        let resolvedDomain: Domain;

        try {
          resolvedDomain = await this.fetchDomainDetails(domainName);
        } catch (err) {
          // Do not stop ingesting other domain entities if a single whois fails
          // to resolve.
          domainsFailed.push(domainName);
          return;
        }

        await callback(resolvedDomain);
      },
      {
        concurrency: 5,
      },
    );

    if (domainsFailed.length) {
      this.logger.warn(
        {
          count: domainsFailed.length,
        },
        'Partial domain list failure',
      );

      this.logger.publishEvent({
        name: 'list_domains_warn',
        description: `Partial domain list failure (count=${
          domainsFailed.length
        }, domains=${domainsFailed.join(', ')})`,
      });
    }
  }
}
