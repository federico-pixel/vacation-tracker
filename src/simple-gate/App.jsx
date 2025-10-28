import React, { useEffect, useRef, useState } from "react";
import { decodeGoogleCredential, isAllowedEmail, getRedirectUrl } from "./auth";

export default function App() {
  const btnRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    function setup() {
      /* global google */
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (resp) => {
          const payload = decodeGoogleCredential(resp.credential);
          if (!payload?.email) {
            setError("Could not read your Google sign in. Please try again.");
            return;
          }
          if (!isAllowedEmail(payload.email)) {
            setError("Only Hostfully accounts on the test list can access this preview.");
            return;
          }
          window.location.href = getRedirectUrl();
        },
        ux_mode: "popup"
      });
      google.accounts.id.renderButton(btnRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "signin_with",        // was: "continue_with"
        logo_alignment: "left"
      });

    }

    if (window.google?.accounts?.id) setup();
    else {
      const t = setInterval(() => {
        if (window.google?.accounts?.id) { clearInterval(t); setup(); }
      }, 100);
      return () => clearInterval(t);
    }
  }, []);

  return (
          <div className="card">
            <div className="brand">Vacation Tracker</div>
            <h1>Sign in with Google</h1>
            <p className="sub">
              Use your Hostfully Google account to continue. You’ll be redirected after sign-in.
            </p>

            <div ref={btnRef} style={{ display: "inline-block", marginTop: 12 }} />

            {error && <div className="err">{error}</div>}

            <div className="meta">
              This preview is limited to test users while the app is in Google’s “Testing” mode.
            </div>
          </div>
  );
}
