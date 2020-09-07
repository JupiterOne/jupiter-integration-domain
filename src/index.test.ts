import {
  Recording,
  createMockStepExecutionContext,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig } from './types';
import {
  ENTITY_DOMAIN_CLASS,
  ENTITY_DOMAIN_TYPE,
  fetchDomains,
  createDomainEntity,
} from '.';
import { getMockIntegrationConfig } from '../test/config';

describe('#fetchDomains', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupRecording({
      directory: __dirname,
      name: 'fetchDomains',
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: getMockIntegrationConfig(),
    });

    await fetchDomains(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      // Since fetching domain details happens in parallel, we need to sort the
      // entities alphabetically by _key, so that the snapshot results remain
      // in the correct order.
      collectedEntities: context.jobState.collectedEntities.sort((a, b) => {
        if (a._key > b._key) return 1;
        if (a._key < b._key) return -1;
        return 0;
      }),
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    expect(context.jobState.collectedEntities).toMatchGraphObjectSchema({
      _class: ENTITY_DOMAIN_CLASS,
      schema: {
        additionalProperties: false,
        properties: {
          _type: { const: ENTITY_DOMAIN_TYPE },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          domainName: { type: 'string' },
          expiresOn: { type: 'number' },
          whoisServer: { type: 'string' },
          registrar: { type: 'string' },
          status: { type: 'string' },
        },
      },
    });
  });
});

describe('#createDomainEntity', () => {
  test('should convert to entity', () => {
    expect(
      createDomainEntity({
        id: '2138514_DOMAIN_COM-VRSN',
        whois_server: 'whois.markmonitor.com',
        updated_date: '2019-09-09T15:39:04Z',
        creation_date: '1997-09-15T04:00:00Z',
        expiration_date: '2028-09-14T04:00:00Z',
        registrar: 'MarkMonitor Inc.',
        emails: 'abusecomplaints@markmonitor.com',
        status:
          'serverUpdateProhibited https://icann.org/epp#serverUpdateProhibited',
        nameservers: 'NS4.GOOGLE.COM',
        contact: {
          registrant: {},
          technical: {},
          admin: {},
          billing: {},
        },
        name: 'google.com',
      }),
    ).toMatchSnapshot();
  });
});
