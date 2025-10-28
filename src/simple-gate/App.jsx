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

      // Official Google button style
      google.accounts.id.renderButton(btnRef.current, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "signin_with",
        logo_alignment: "left",
        width: 320
      });
    }

    if (window.google?.accounts?.id) {
      setup();
    } else {
      const t = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(t);
          setup();
        }
      }, 100);
      return () => clearInterval(t);
    }
  }, []);

  return (
    <div className="gate">
      <div className="card google-like">
        {/* Header (Google-like) */}
        <div className="header">
          {/* Vacation Tracker logo (hosted) */}
          <img
            className="g-icon"
            src="https://vacationtracker.io/static/img/logomark.png"
            alt="Vacation Tracker logo"
            width="40"
            height="40"
          />

          <h1>Choose an account</h1>
          <p className="sub">
            to continue to <span className="brand-link">Vacation Tracker</span>
          </p>
        </div>

        {/* Official Google Sign-In button */}
        <div ref={btnRef} className="g-btn" />

        {/* Error display */}
        {error && <div className="err">{error}</div>}

        {/* Footer */}
        <div className="footer">
          <p className="meta">
            Before using this app, you can review Vacation Tracker’s{" "}
            <a
              href="https://vacationtracker.io/privacy-policy"
              target="_blank"
              rel="noreferrer"
            >
              privacy policy
            </a>{" "}
            and{" "}
            <a
              href="https://vacationtracker.io/terms-of-service"
              target="_blank"
              rel="noreferrer"
            >
              terms of service
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
