function excludeField(object, fields) {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !fields.includes(key)),
  );
}

function buildHateoasUrl(basePath: string, queryParams): string {
  return `${basePath}?` + new URLSearchParams(queryParams).toString();
}

export { excludeField, buildHateoasUrl };
