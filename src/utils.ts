export function getDomainListFromConfigParam(
  domainConfig: string | string[],
): string[] {
  return typeof domainConfig === 'string'
    ? domainConfig
        .trim()
        .replace(/\s*,\s*/g, ',')
        .split(',')
    : domainConfig.map((d) => d.trim());
}
