export function validatePhoneNG(phone: string): boolean {
  return /^(\+234|0)[789][01]\d{8}$/.test(phone);
}
