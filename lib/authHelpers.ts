export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function friendlyError(message: string): string {
  if (message.includes("Invalid login credentials")) return "Wrong email or password.";
  if (message.includes("Email not confirmed")) return "Please confirm your email before signing in.";
  if (message.includes("User already registered")) return "An account with this email already exists.";
  if (message.includes("rate limit")) return "Too many attempts. Please wait a moment and try again.";
  return message;
}
