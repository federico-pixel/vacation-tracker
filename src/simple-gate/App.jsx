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
        shape: "rectangular",
        text: "signin_with",      // official GIS text
        logo_alignment: "left",
        width: 320               // keeps layout crisp
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
          <div className="card google-like">
  <img
    className="g-logo"
    src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png"
    alt="Google"
    width="48"
    height="48"
    loading="eager"
  />

  <h1 className="g-title">Sign in</h1>

  <p className="g-sub">
    Continue to <strong>Vacation&nbsp;Tracker</strong>
  </p>

  <div ref={btnRef} className="g-btn"></div>

  {error && <div className="err">{error}</div>}

  <div className="g-footer">
    <a className="g-link" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
      Privacy
    </a>
    <span aria-hidden="true">·</span>
    <a className="g-link" href="https://policies.google.com/terms" target="_blank" rel="noreferrer">
      Terms
    </a>
  </div>
</div>

  );
}
