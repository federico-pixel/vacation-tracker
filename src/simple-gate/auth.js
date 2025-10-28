// src/simple-gate/auth.js
import { jwtDecode } from "jwt-decode";

export function decodeGoogleCredential(cred) {
  try {
    return jwtDecode(cred); // { email, name, picture, ... }
  } catch {
    return null;
  }
}

export function isAllowedEmail(email) {
  return String(email).toLowerCase().endsWith("@hostfully.com");
}

export function getRedirectUrl() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next || import.meta.env.VITE_REDIRECT_URL || "/";
}
