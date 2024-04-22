import {
  createIntegrationEntity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../../constants';
import { Domain } from '../../DomainProviderClient';

export function createDomainEntity(domain: Domain) {
  return createIntegrationEntity({
    entityData: {
      source: domain,
      assign: {
        _key: `internet_domain_${domain.name}`,
        _type: Entities.DOMAIN._type,
        _class: Entities.DOMAIN._class,
        id: domain.id,
        name: domain.name,
        displayName: domain.name,
        domainName: domain.name,
        expiresOn: parseTimePropertyValue(domain.expiration_date),
        updatedOn: parseTimePropertyValue(domain.updated_date),
        createdOn: parseTimePropertyValue(domain.creation_date),
        whoisServer: domain.whois_server,
        registrar: domain.registrar,
        status: domain.status,
        contactEmails: Array.isArray(domain.emails)
          ? domain.emails
          : [domain.emails],
        nameservers: Array.isArray(domain.nameservers)
          ? domain.nameservers
          : [domain.nameservers],
      },
    },
  });
}
