function excludeField(object, fields) {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !fields.includes(key)),
  );
}

export { excludeField };
