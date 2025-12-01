exports.cleanNumber = (value) => {
  if (typeof value === "string") return parseFloat(value);
  return value;
};
