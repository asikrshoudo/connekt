// "xiaomi" + "Redmi 10 Prime" becomes "Xiaomi Redmi 10 Prime".
export function formatDeviceName(brand: string, model: string): string {
  const cleanBrand = brand.trim();
  const cleanModel = model.trim();
  const pretty = cleanBrand.charAt(0).toUpperCase() + cleanBrand.slice(1);
  if (!cleanModel) return pretty || 'This phone';
  if (!pretty || cleanModel.toLowerCase().startsWith(pretty.toLowerCase())) return cleanModel;
  return `${pretty} ${cleanModel}`;
}

// Shows the start and end of an id, not all of it.
export function shortId(id: string): string {
  return id.length <= 10 ? id : `${id.slice(0, 4)}...${id.slice(-4)}`;
}
