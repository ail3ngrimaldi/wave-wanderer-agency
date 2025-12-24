/**
 * Genera un slug URL-friendly a partir de un texto
 * Ejemplo: "Escapada a Miami!" -> "escapada-a-miami"
 */
export const textToSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD') // Normalizar caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-'); // Múltiples guiones a uno solo
};

/**
 * Genera un código random alfanumérico
 * Ejemplo: "a3x9k2"
 */
export const generateRandomCode = (length: number = 6): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Genera un slug completo: titulo-slug-abc123
 */
export const generatePackageSlug = (title: string): string => {
  const baseSlug = textToSlug(title);
  const randomCode = generateRandomCode(6);
  return `${baseSlug}-${randomCode}`;
};
