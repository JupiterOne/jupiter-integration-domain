declare module "whois-api" {
  export interface WhoisLookupDomain {
    id: string;
    updated_date: string;
    creation_date: string;
    expiration_date: string;
    whois_server: string;
    registrar: string;
    emails: string | string[];
    status: string;
    nameservers: string | string[];
    contact: {
      registrant: object;
      technical: object;
      admin: object;
      billing: object;
    }
  }

  export function lookup(
    domain: string,
    cb: (err: Error | null, result: WhoisLookupDomain) => void,
  ): void;
}
