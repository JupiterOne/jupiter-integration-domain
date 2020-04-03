import { createDomainEntity } from "./converters";
import { Domain } from "./DomainProviderClient";
import { DOMAIN_ENTITY_CLASS, DOMAIN_ENTITY_TYPE, DomainEntity } from "./types";
import getTime from "./util/getTime";

test("createDomainEntity", () => {
  const domainName = "hello.com";

  const domain: Domain = {
    name: domainName,
    updatedDate: "2019-05-10T17:28:33Z",
    creationDate: "2004-08-20T18:07:36Z",
    expirationDate: "2020-06-01T11:59:59Z",
  };

  const expectedDomainEntity: DomainEntity = {
    _class: DOMAIN_ENTITY_CLASS,
    _key: `internet_domain_${domainName}`,
    _type: DOMAIN_ENTITY_TYPE,
    name: domainName,
    displayName: domainName,
    domainName,
    expiresOn: getTime(domain.expirationDate),
    updatedOn: getTime(domain.updatedDate),
    createdOn: getTime(domain.creationDate)
  };

  expect(createDomainEntity(domain)).toEqual(expectedDomainEntity);
});
