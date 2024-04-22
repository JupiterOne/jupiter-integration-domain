import DomainProviderClient, { Domain } from './DomainProviderClient';
import { createMockIntegrationLogger } from '@jupiterone/integration-sdk-testing';
import { WhoisLookupDomain } from './types';
import whois from 'whois-api';

function getMockDomainProperties() {
  const domainProperties: WhoisLookupDomain = {
    id: '2331770392_DOMAIN_COM-VRSN',
    whois_server: 'whois.godaddy.com',
    updated_date: '2019-03-19T18:41:23Z',
    creation_date: '2018-11-11T19:35:40Z',
    expiration_date: '2024-11-11T19:35:40Z',
    registrar: 'GoDaddy.com, LLC',
    emails: 'abuse@godaddy.com',
    status:
      'clientUpdateProhibited https://icann.org/epp#clientUpdateProhibited',
    nameservers: 'NS14.DOMAINCONTROL.COM',
    contact: { registrant: {}, technical: {}, admin: {}, billing: {} },
  };

  return domainProperties;
}

let client: DomainProviderClient;

beforeEach(() => {
  client = new DomainProviderClient(createMockIntegrationLogger());
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('fetchDomainDetails', () => {
  test('should allow fetching domain information', async () => {
    const domainProperties = getMockDomainProperties();

    jest.spyOn(whois, 'lookup').mockImplementationOnce((domain, cb: any) => {
      cb(null, domainProperties);
    });

    const expectedDomain: Domain = {
      ...domainProperties,
      name: 'google.com',
    };

    expect(await client.fetchDomainDetails('google.com')).toEqual(
      expectedDomain,
    );
  });

  test('should allow iterating array of domains', async () => {
    const domainProperties = getMockDomainProperties();

    jest
      .spyOn(whois, 'lookup')
      .mockImplementationOnce((domain, cb: any) => {
        cb(null, domainProperties);
      })
      .mockImplementationOnce((domain, cb: any) => {
        cb(null, domainProperties);
      })
      .mockImplementationOnce((domain, cb: any) => {
        cb(new Error('should not call 3 times'), null as any);
      });

    const expectedDomains: Domain[] = [
      {
        ...domainProperties,
        name: 'facebook.com',
      },
      {
        ...domainProperties,
        name: 'google.com',
      },
    ];

    const actualDomains: Domain[] = [];

    await client.iterateDomains(
      ['facebook.com', 'google.com'],
      async (domain) => {
        actualDomains.push(domain);
        return Promise.resolve();
      },
    );

    const sortedActualDomains = actualDomains.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

    expect(sortedActualDomains).toEqual(expectedDomains);
  });

  test('should log warn and publish warn event if domain fails to resolve', async () => {
    const domainProperties = getMockDomainProperties();
    const mockLogger = createMockIntegrationLogger();

    const listDomainsWarnFn = jest.fn();
    mockLogger.on('event', listDomainsWarnFn);

    client = new DomainProviderClient(mockLogger);

    jest.spyOn(whois, 'lookup').mockImplementation((domain, cb: any) => {
      if (domain === 'facebook.com' || domain === 'google.com') {
        cb(new Error('expected error'), null as any);
      } else {
        cb(null, domainProperties);
      }
    });

    const expectedDomains: Domain[] = [
      {
        ...domainProperties,
        name: 'jupiterone.com',
      },
      {
        ...domainProperties,
        name: 'jupiterone.io',
      },
    ];

    const actualDomains: Domain[] = [];

    await client.iterateDomains(
      ['facebook.com', 'jupiterone.com', 'google.com', 'jupiterone.io'],
      async (domain) => {
        actualDomains.push(domain);
        return Promise.resolve();
      },
    );

    const sortedActualDomains = actualDomains.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

    const expectedDomainsFailed = ['facebook.com', 'google.com'];
    expect(sortedActualDomains).toEqual(expectedDomains);

    expect(listDomainsWarnFn).toHaveBeenCalledTimes(1);
    expect(listDomainsWarnFn).toHaveBeenCalledWith({
      name: 'warn_incomplete_data',
      level: 'warn',
      description: `Partial domain list failure (count=${
        expectedDomainsFailed.length
      }, domains=${expectedDomainsFailed.join(', ')})`,
    });
  });

  test('should retry when domain detail fetching fails', async () => {
    const domainProperties = getMockDomainProperties();

    const domainLookupMock = jest
      .spyOn(whois, 'lookup')
      .mockImplementationOnce((domain, cb: any) => {
        cb(new Error('expected error'), null as any);
      })
      .mockImplementationOnce((domain, cb: any) => {
        cb(null, domainProperties);
      });

    const expectedDomain: Domain = {
      ...domainProperties,
      name: 'google.com',
    };

    expect(await client.fetchDomainDetails('google.com')).toEqual(
      expectedDomain,
    );

    expect(domainLookupMock).toHaveBeenCalledTimes(2);
    expect(domainLookupMock).toHaveBeenNthCalledWith(
      1,
      'google.com',
      expect.any(Function),
    );
    expect(domainLookupMock).toHaveBeenNthCalledWith(
      2,
      'google.com',
      expect.any(Function),
    );
  });

  test('should reject if whois lookup rejects max amount of times', async () => {
    const domainLookupMock = jest
      .spyOn(whois, 'lookup')
      .mockImplementation((domain, cb: any) => {
        cb(new Error('expected error'), null as any);
      });

    await expect(client.fetchDomainDetails('google.com')).rejects.toThrowError(
      'expected error',
    );

    expect(domainLookupMock).toHaveBeenCalledTimes(3);
    expect(domainLookupMock).toHaveBeenNthCalledWith(
      1,
      'google.com',
      expect.any(Function),
    );
    expect(domainLookupMock).toHaveBeenNthCalledWith(
      2,
      'google.com',
      expect.any(Function),
    );
    expect(domainLookupMock).toHaveBeenNthCalledWith(
      3,
      'google.com',
      expect.any(Function),
    );
  });
});
