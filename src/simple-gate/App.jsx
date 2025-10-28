import React, { useEffect, useRef, useState } from "react";
import { decodeGoogleCredential, isAllowedEmail } from "./auth";
import Landing from "./Landing";

export default function App() {
  const btnRef = useRef(null);
  const [error, setError] = useState("");

  const isLanding =
    typeof window !== "undefined" && window.location.pathname === "/landing";

  useEffect(() => {
    if (isLanding) return; // don't init GIS on the landing page

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
            setError(
              "Only Hostfully accounts on the test list can access this preview."
            );
            return;
          }
          // redirect to the phishing-test landing page
          window.location.href = "/landing";
        },
        ux_mode: "popup",
      });

      google.accounts.id.renderButton(btnRef.current, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "signin_with",
        logo_alignment: "left",
        width: 320,
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

  // /landing route
  if (isLanding) {
    return <Landing />;
  }

  // default: wide, two-column Google-like chooser
  return (
    <div className="gate">
      <div className="card google-like">
        {/* top header bar */}
        <div className="sheet-head">
          <img
            className="head-gmark"
            src="https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_24dp.png"
            alt=""
            width="20"
            height="20"
          />
          <span className="head-text">Sign in with Google</span>
        </div>

        {/* two-column body */}
        <div className="sheet-body">
          {/* left column */}
          <div className="col-left">
            <img
              className="g-icon big"
              src="https://vacationtracker.io/static/img/logomark.png"
              alt="Vacation Tracker"
              width="56"
              height="56"
            />
            <h1 className="headline">Choose an account</h1>
            <p className="sub-lg">
              to continue to <span className="brand-link">Vacation Tracker</span>
            </p>
          </div>

          {/* right column */}
          <div className="col-right">
            {/* real GIS button (auth) */}
            <div className="g-btn" ref={btnRef} />

            <div className="divider" />
            <div className="row faux" role="button" aria-label="Use another account">
              <div className="ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="3.5" stroke="#5f6368" />
                  <path
                    d="M4 20c.6-3.9 4-6.5 8-6.5s7.4 2.6 8 6.5"
                    stroke="#5f6368"
                  />
                </svg>
              </div>
              <div className="row-label">Use another account</div>
            </div>
            <div className="divider" />

            <p className="meta top-pad">
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

        {/* error (if any) */}
        {error && <div className="err">{error}</div>}
      </div>
    </div>
  );
}
