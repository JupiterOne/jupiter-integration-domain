import { Domain } from "./DomainProviderClient";

import { DOMAIN_ENTITY_CLASS, DOMAIN_ENTITY_TYPE, DomainEntity } from "./types";
import getTime from "./util/getTime";

export function createDomainEntity(domain: Domain): DomainEntity {
  return {
    _key: `domain_${domain.name}`,
    _type: DOMAIN_ENTITY_TYPE,
    _class: DOMAIN_ENTITY_CLASS,
    name: domain.name,
    displayName: domain.name,
    domainName: domain.name,
    expiresOn: getTime(domain.expirationDate),
    updatedOn: getTime(domain.updatedDate),
    createdOn: getTime(domain.creationDate)
  };
}
