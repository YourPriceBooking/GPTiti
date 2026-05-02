"use client";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 mb-20 text-slate-900 font-sans">
        <h1 className="text-4xl font-extrabold mb-4">Privacy Policy</h1>
        <p className="text-slate-500 mb-8">Last updated: April 7, 2026</p>

        <div className="space-y-8 leading-relaxed text-lg text-slate-800">
          <p>
            This Privacy Policy explains how Your Price Booking OÜ ("we", "us",
            "our") collects and uses your data when you use GPTiti ("Service").
          </p>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              1. Company Information
            </h2>
            <p>Company name: Your Price Booking OÜ</p>
            <p>Registration code: 16873256</p>
            <p>
              Address: Harju maakond, Tallinn, Kesklinna linnaosa, Narva mnt 5,
              10117, Estonia
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              2. Data We Collect
            </h2>
            <p>We collect the following data:</p>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-bold">Account Data</h3>
                <ul className="list-disc ml-6">
                  <li>Email address (via Google authentication)</li>
                  <li>Basic profile information provided by Google</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold">Usage Data</h3>
                <ul className="list-disc ml-6">
                  <li>Prompts and generated responses</li>
                  <li>Token usage</li>
                  <li>Interaction data</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold">Technical Data</h3>
                <ul className="list-disc ml-6">
                  <li>IP address</li>
                  <li>Device and browser information</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              3. How We Use Data
            </h2>
            <p>We use your data to:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Provide and operate the Service</li>
              <li>Track token usage</li>
              <li>Improve performance and user experience</li>
              <li>Ensure security and prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              4. Chat Storage
            </h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>Chats are stored to provide functionality</li>
              <li>Users can delete chats at any time</li>
              <li>Deleted chats are permanently removed from our systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              5. Legal Basis (GDPR)
            </h2>
            <p>We process your data based on:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Contract (providing the Service)</li>
              <li>Legitimate interest (improving and securing the Service)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              6. Third-Party Services
            </h2>
            <p>We use:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Google Authentication — for login</li>
              <li>Stripe — for payments</li>
              <li>Analytics tools — for usage analysis</li>
              <li>AI providers (e.g. GPT models) — for generating responses</li>
            </ul>
            <p className="mt-4">
              These providers may process your data according to their own
              privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              7. Cookies
            </h2>
            <p>We do not use cookies for tracking or storing personal data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              8. Data Sharing
            </h2>
            <p>We do not sell your personal data. We may share data only:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>with service providers (as listed above)</li>
              <li>if required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              9. Data Retention
            </h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>Account data is stored while your account is active</li>
              <li>Chats are stored until you delete them</li>
              <li>Some data may be retained for legal or security purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              10. AI Data Processing
            </h2>
            <p>
              Your inputs (prompts) and outputs may be processed by third-party
              AI providers to generate responses.
            </p>
            <p className="mt-2 font-semibold">
              By using the Service, you acknowledge that:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>your data may be transmitted to these providers</li>
              <li>processing is required to deliver AI functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              11. Your Rights (GDPR)
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Access your data</li>
              <li>Request correction</li>
              <li>Request deletion</li>
              <li>Restrict processing</li>
              <li>Data portability</li>
            </ul>
            <p className="mt-4">
              To exercise your rights, contact us at:{" "}
              <span className="text-blue-600 font-bold">
                support@gptiti.com
              </span>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              12. Security
            </h2>
            <p>
              We implement reasonable technical and organizational measures to
              protect your data. However, no system is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              13. International Users
            </h2>
            <p>
              We operate globally. By using the Service, you consent to data
              processing in the EU and other jurisdictions where our providers
              operate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              14. Changes to this Policy
            </h2>
            <p>
              We may update this Privacy Policy. Continued use of the Service
              means acceptance of changes.
            </p>
          </section>

          <section className="pb-10">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              15. Contact
            </h2>
            <p>
              For privacy-related questions, contact:{" "}
              <a
                href="mailto:support@gptiti.com"
                className="font-bold text-blue-600 hover:underline"
              >
                support@gptiti.com
              </a>
            </p>
          </section>
        </div>
    </div>
  );
};

export default PrivacyPolicy;
