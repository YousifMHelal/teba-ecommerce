export const ADMIN_DASHBOARD_PIN_LENGTH = 6;

export function isValidAdminPin(pin: string) {
  return new RegExp(`^\\d{${ADMIN_DASHBOARD_PIN_LENGTH}}$`).test(pin);
}

export function normalizeAdminPin(pin: string) {
  return isValidAdminPin(pin) ? pin : "010010";
}
