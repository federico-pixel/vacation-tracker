import React, { useEffect, useRef, useState } from "react";
import { decodeGoogleCredential, isAllowedEmail } from "./auth";
import Landing from "./Landing";

export default function App() {
  const btnRef = useRef(null);
  const [error, setError] = useState("");

  const isLanding =
    typeof window !== "undefined" && window.location.pathname === "/landing";

  useEffect(() => {
    if (isLanding) return; // don't init GIS on landing page

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
          window.location.href = "/landing";
        },
        ux_mode: "popup",
      });

      // Render official Google button (overlaid invisibly on the account row)
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

  if (isLanding) {
    return <Landing />;
  }

  return (
    <div className="gate">
      <div className="card google-like">
        {/* Top header bar */}
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

        {/* Two-column body */}
        <div className="sheet-body">
          {/* Left column */}
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

          {/* Right column */}
          <div className="col-right">
            {/* Account row with invisible Google button overlay */}
            <div className="btn-overlay">
              <div
                className="account-row"
                role="button"
                aria-label="Sign in as account"
              >
                {/* Avatar: env override or neutral silhouette */}
                {import.meta.env.VITE_ACCOUNT_AVATAR ? (
                  <img
                    className="avatar"
                    src={import.meta.env.VITE_ACCOUNT_AVATAR}
                    alt=""
                    width="40"
                    height="40"
                  />
                ) : (
                  <svg
                    className="avatar"
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                  >
                    <circle cx="20" cy="20" r="20" fill="#E8EAED" />
                    <circle cx="20" cy="16.5" r="7" fill="#BDC1C6" />
                    <path
                      d="M8 33c1.2-6.5 6.4-10 12-10s10.8 3.5 12 10"
                      fill="#BDC1C6"
                    />
                  </svg>
                )}

                <div className="row-main">
                  <div className="acct-name">
                    {import.meta.env.VITE_ACCOUNT_NAME || "Federico Dominguez"}
                  </div>
                  <div className="acct-email">
                    {import.meta.env.VITE_ACCOUNT_EMAIL ||
                      "federico@hostfully.com"}
                  </div>
                </div>

                <img
                  className="g-mark"
                  src="https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_24dp.png"
                  alt=""
                  width="18"
                  height="18"
                />
              </div>

              {/* Real Google button (clickable, visually hidden via CSS) */}
              <div className="g-btn g-overlay" ref={btnRef} />
            </div>

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

        {/* Error (if any) */}
        {error && <div className="err">{error}</div>}
      </div>
    </div>
  );
}
