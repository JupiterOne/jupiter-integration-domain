export function getDomainListFromConfigParam(domainConfig: string) {
  return domainConfig
    .trim()
    .replace(/\s*,\s*/g, ",")
    .split(",");
}
