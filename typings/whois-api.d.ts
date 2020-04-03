declare module "whois-api" {
  export interface WhoisLookupDomain {
    updated_date: string;
    creation_date: string;
    expiration_date: string;
  }

  export function lookup(
    domain: string,
    cb: (err: Error | null, result: WhoisLookupDomain) => void,
  ): void;
}
