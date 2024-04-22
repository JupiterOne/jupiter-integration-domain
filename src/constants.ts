import { StepEntityMetadata } from '@jupiterone/integration-sdk-core';

export const Steps = {
  DOMAIN: 'fetch-domains',
};

export const Entities: Record<'DOMAIN', StepEntityMetadata> = {
  DOMAIN: {
    resourceName: 'Domain',
    _type: 'internet_domain',
    _class: ['Domain'],
  },
};
