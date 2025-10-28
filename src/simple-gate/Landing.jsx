import React from "react";

export default function Landing() {
  return (
    <div className="gate">
      <div className="card phishing">
        <h1>This was a phishing test ⚠️</h1>
        <p className="sub">
          You’ve reached a controlled simulation used to raise awareness about
          credential security and phishing prevention at Hostfully.
        </p>

        <div className="details">
          <p>
            No personal data was collected, and no real login occurred.
            This exercise is designed to help you recognize realistic phishing
            attempts before they can do harm.
          </p>

          <p>
            Please review our internal security guidelines and always verify URLs
            and domains before entering credentials.
          </p>
        </div>

        <p className="meta">
          Learn more about <a href="#">security best practices</a> or contact{" "}
          <a href="mailto:security@hostfully.com">security@hostfully.com</a> if
          you have questions.
        </p>
      </div>
    </div>
  );
}
