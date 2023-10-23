function excludeField(object, fields) {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !fields.includes(key)),
  );
}

function buildHateoasUrl(basePath: string, cursor: string): string {
  return `${basePath}?cursor=${cursor}`;
}

export { excludeField, buildHateoasUrl };
