import { createDomainEntity } from './converters';

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
