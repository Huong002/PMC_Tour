export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isValidPhone(phone: string): boolean {
  const re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  return re.test(phone);
}
