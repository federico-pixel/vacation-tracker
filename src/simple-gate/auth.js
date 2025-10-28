import jwt_decode from "jwt-decode";

export function decodeGoogleCredential(cred) {
  try {
    return jwt_decode(cred); // contains email, name, picture, etc.
  } catch {
    return null;
  }
}

export function isAllowedEmail(email) {
  // keep this simple while OAuth is in Testing
  return String(email).toLowerCase().endsWith("@hostfully.com");
}

export function getRedirectUrl() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next || import.meta.env.VITE_REDIRECT_URL || "/";
}
