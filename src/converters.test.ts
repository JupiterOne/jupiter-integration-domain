import { createDomainEntity } from "./converters";
import { Domain } from "./DomainProviderClient";
import { DOMAIN_ENTITY_CLASS, DOMAIN_ENTITY_TYPE, DomainEntity } from "./types";
import getTime from "./util/getTime";
import { domainProperties } from "../tests/constants";

test("createDomainEntity", () => {
  const domainName = "hello.com";

  const domain: Domain = {
    ...domainProperties,
    name: domainName,
  };

  const expectedDomainEntity: DomainEntity = {
    _class: DOMAIN_ENTITY_CLASS,
    _key: `internet_domain_${domainName}`,
    _type: DOMAIN_ENTITY_TYPE,
    _rawData: [{ name: 'default', rawData: domain }],
    name: domainName,
    displayName: domainName,
    domainName,
    expiresOn: getTime(domain.expiration_date),
    updatedOn: getTime(domain.updated_date),
    createdOn: getTime(domain.creation_date),
    id: '2331770392_DOMAIN_COM-VRSN',
    whoisServer: 'whois.godaddy.com',
    registrar: 'GoDaddy.com, LLC',
    contactEmails: 'abuse@godaddy.com',
    status:
      'clientUpdateProhibited https://icann.org/epp#clientUpdateProhibited',
    nameservers: 'NS14.DOMAINCONTROL.COM',
  };

  expect(createDomainEntity(domain)).toEqual(expectedDomainEntity);
});
