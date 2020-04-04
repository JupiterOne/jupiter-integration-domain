import { Domain } from "./DomainProviderClient";

import { DOMAIN_ENTITY_CLASS, DOMAIN_ENTITY_TYPE, DomainEntity } from "./types";
import getTime from "./util/getTime";

export function createDomainEntity(domain: Domain): DomainEntity {
  return {
    _key: `internet_domain_${domain.name}`,
    _type: DOMAIN_ENTITY_TYPE,
    _class: DOMAIN_ENTITY_CLASS,
    _rawData: [{ name: "default", rawData: domain }],
    id: domain.id,
    name: domain.name,
    displayName: domain.name,
    domainName: domain.name,
    expiresOn: getTime(domain.expiration_date),
    updatedOn: getTime(domain.updated_date),
    createdOn: getTime(domain.creation_date),
    whoisServer: domain.whois_server,
    registrar: domain.registrar,
    status: domain.status,
    contactEmails: domain.emails,
    nameservers: domain.nameservers,
  };
}
