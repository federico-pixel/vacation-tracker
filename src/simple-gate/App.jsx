import React, { useEffect, useRef, useState } from "react";
import { decodeGoogleCredential, isAllowedEmail } from "./auth";
import Landing from "./Landing";

export default function App() {
  const btnRef = useRef(null);
  const [error, setError] = useState("");

  const isLanding =
    typeof window !== "undefined" && window.location.pathname === "/landing";

  useEffect(() => {
    if (isLanding) return; // Don't init GIS on the landing page

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
          // ✅ Redirect to the phishing-test landing page
          window.location.href = "/landing";
        },
        ux_mode: "popup"
      });

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
  }, [isLanding]);

  // If we're on /landing, show the phishing-test page
  if (isLanding) {
    return <Landing />;
  }

  // Default: Google-like sign-in screen
  return (
    <div className="gate">
      <div className="card google-like">
        <div className="header">
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

        <div ref={btnRef} className="g-btn" />

        {error && <div className="err">{error}</div>}

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
