/**
 * @function isExpired
 * @description Determina si una fecha de caducidad ya ha pasado.
 * @param date Fecha a evaluar.
 * @returns true si la fecha ya expiró.
 */
export function isExpired(date: Date): boolean {
  return date.getTime() < Date.now();
}
