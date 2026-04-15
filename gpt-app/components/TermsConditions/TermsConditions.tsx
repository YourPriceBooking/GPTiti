"use client";

import PageNav from "../common/PageNav";

const TermsConditions = () => {
  return (
    <div className="min-h-screen relative h-full bg-white text-slate-900 font-sans">
      <PageNav />

      <main className="max-w-4xl mx-auto p-6 mb-20">
        <h1 className="text-4xl font-extrabold mb-4">Terms and Conditions</h1>
        <p className="text-slate-500 mb-8">Last updated: April 7, 2026</p>

        <div className="space-y-8 leading-relaxed text-lg text-slate-800">
          <p>
            These Terms and Conditions ("Terms") govern your use of the GPTiti
            service ("Service") operated by Your Price Booking OÜ.
          </p>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              1. Company Information
            </h2>
            <div className="space-y-1">
              <p>Company name: Your Price Booking OÜ</p>
              <p>Registration code: 16873256</p>
              <p>
                Registered address: Harju maakond, Tallinn, Kesklinna linnaosa,
                Narva mnt 5, 10117, Estonia
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              2. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Service, you agree to be bound by these
              Terms. If you do not agree, you must not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              3. Eligibility
            </h2>
            <p>
              You must be at least 13 years old (or the minimum age required in
              your country) to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              4. Account Registration
            </h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Users must sign in using Google authentication.</li>
              <li>Each user receives 10,000 free tokens upon registration.</li>
              <li>
                You are responsible for maintaining access to your account.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              5. Tokens and Payments
            </h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>The Service operates on a token-based system.</li>
              <li>Tokens can be purchased via Stripe.</li>
              <li>
                Tokens:
                <ul className="list-[circle] ml-6 mt-1 space-y-1 text-slate-700">
                  <li>do not expire</li>
                  <li>are non-refundable</li>
                </ul>
              </li>
              <li>Weekly, users may claim 10,000 free tokens.</li>
              <li>
                Token transfer between users may be introduced in the future.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              6. Use of the Service
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc ml-6 space-y-2 mt-2">
              <li>Use the Service for illegal purposes</li>
              <li>Attempt to exploit, abuse, or overload the system</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
            <p className="mt-4">
              Content generation is subject to limitations imposed by
              third-party AI providers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              7. AI Risks and Disclaimer
            </h2>
            <p>
              The Service relies on third-party artificial intelligence systems.
            </p>
            <p className="mt-2">By using the Service, you acknowledge that:</p>
            <ul className="list-disc ml-6 space-y-2 mt-2">
              <li>
                AI-generated content may be inaccurate, incomplete, or
                misleading
              </li>
              <li>
                Outputs may reflect biases or errors from underlying models
              </li>
              <li>
                Responses are generated automatically and are not reviewed by
                humans
              </li>
            </ul>
            <p className="mt-4 font-bold">
              The Service is provided for informational purposes only. You must
              not rely on it for:
            </p>
            <ul className="list-disc ml-6 space-y-1 mt-2">
              <li>medical advice</li>
              <li>legal advice</li>
              <li>financial or investment decisions</li>
              <li>any situation where errors could lead to harm or loss</li>
            </ul>
            <p className="mt-4">
              You are solely responsible for how you use the generated content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              8. Data and Chats
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-slate-800">
              <li>Chats are stored to provide the Service</li>
              <li>Users can delete chats at any time</li>
              <li>
                Once deleted, chats are permanently removed from our systems
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              9. Third-Party Services
            </h2>
            <p>The Service relies on third-party providers, including:</p>
            <ul className="list-disc ml-6 space-y-1 mt-2">
              <li>AI model providers</li>
              <li>Payment processors (Stripe)</li>
              <li>Authentication providers (Google)</li>
            </ul>
            <p className="mt-4">
              We are not responsible for their services, availability, or
              performance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              10. No Cookies Usage
            </h2>
            <p>We do not use cookies for tracking or storing personal data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              11. Limitation of Liability
            </h2>
            <p>To the maximum extent permitted by law:</p>
            <ul className="list-disc ml-6 space-y-2 mt-2">
              <li>The Service is provided "as is"</li>
              <li>
                We make no warranties regarding accuracy, reliability, or
                availability
              </li>
              <li>
                We are not liable for:
                <ul className="list-[circle] ml-6 mt-1 space-y-1 text-slate-700">
                  <li>indirect or consequential damages</li>
                  <li>loss of data</li>
                  <li>loss of profits</li>
                  <li>service interruptions</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              12. Termination
            </h2>
            <p>We reserve the right to suspend or terminate access if:</p>
            <ul className="list-disc ml-6 space-y-2 mt-2">
              <li>Terms are violated</li>
              <li>Abuse or misuse is detected</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              13. Changes to Terms
            </h2>
            <p>
              We may update these Terms at any time. Continued use of the
              Service means you accept the updated Terms.
            </p>
          </section>

          <section className="pb-10">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              14. Contact
            </h2>
            <p>
              For any questions, contact us at:{" "}
              <a
                href="mailto:support@gptiti.com"
                className="font-bold text-blue-600 hover:underline"
              >
                support@gptiti.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsConditions;
