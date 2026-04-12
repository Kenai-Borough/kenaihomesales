import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300 hover:underline">&larr; Back to home</Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-400">Effective: April 2026</p>

      <nav className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Table of Contents</h2>
        <ol className="mt-3 list-decimal list-inside space-y-1 text-sm text-sky-400">
            <li><a href="#acceptance" className="hover:text-sky-300 hover:underline">Acceptance of Terms</a></li>
            <li><a href="#description" className="hover:text-sky-300 hover:underline">Description of Service</a></li>
            <li><a href="#accounts" className="hover:text-sky-300 hover:underline">User Accounts</a></li>
            <li><a href="#user-content" className="hover:text-sky-300 hover:underline">User-Generated Content</a></li>
            <li><a href="#prohibited" className="hover:text-sky-300 hover:underline">Prohibited Conduct</a></li>
            <li><a href="#ip" className="hover:text-sky-300 hover:underline">Intellectual Property</a></li>
            <li><a href="#third-party" className="hover:text-sky-300 hover:underline">Third-Party Services</a></li>
            <li><a href="#real-estate" className="hover:text-sky-300 hover:underline">Real Estate Disclaimers</a></li>
            <li><a href="#disclaimers" className="hover:text-sky-300 hover:underline">Disclaimers and Limitation of Liability</a></li>
            <li><a href="#intermediary" className="hover:text-sky-300 hover:underline">Platform as Intermediary</a></li>
            <li><a href="#indemnification" className="hover:text-sky-300 hover:underline">Indemnification</a></li>
            <li><a href="#disputes" className="hover:text-sky-300 hover:underline">Dispute Resolution</a></li>
            <li><a href="#modifications" className="hover:text-sky-300 hover:underline">Modification of Terms</a></li>
            <li><a href="#termination" className="hover:text-sky-300 hover:underline">Termination</a></li>
            <li><a href="#governing-law" className="hover:text-sky-300 hover:underline">Governing Law</a></li>
            <li><a href="#contact" className="hover:text-sky-300 hover:underline">Contact Information</a></li>
        </ol>
      </nav>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-slate-300">
        <section id="acceptance">
          <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
          <p className="mt-3">By accessing or using Kenai Home Sales ("kenaihomesales.com"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the platform. These Terms constitute a legally binding agreement between you and Kenai Peninsula Network / Kenai Borough LLC ("we," "us," or "our").</p>
          <p className="mt-3">We may update these Terms from time to time. Your continued use of the platform after changes are posted constitutes acceptance of the revised Terms.</p>
        </section>

        <section id="description">
          <h2 className="text-2xl font-semibold text-white">2. Description of Service</h2>
          <p className="mt-3">Kenai Home Sales (kenaihomesales.com) is a For Sale By Owner (FSBO) home sales marketplace that connects homeowners directly with buyers on the Kenai Peninsula, Alaska. The platform provides professional listing tools, market data, and informational resources for direct residential transactions.</p>
        </section>

        <section id="accounts">
          <h2 className="text-2xl font-semibold text-white">3. User Accounts</h2>
          <p className="mt-3">You may need to create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to provide accurate, current, and complete information during registration and to update it as necessary.</p>
          <p className="mt-3">Your account is part of the Kenai Peninsula Network and may be used across affiliated sites. You must be at least 18 years of age to create an account. We reserve the right to suspend or terminate accounts that violate these Terms.</p>
        </section>

        <section id="user-content">
          <h2 className="text-2xl font-semibold text-white">4. User-Generated Content</h2>
          <p className="mt-3">You retain ownership of content you submit to the platform ("User Content"), including listings, photos, descriptions, reviews, and messages. By submitting User Content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your content in connection with operating and promoting the platform.</p>
          <p className="mt-3">You represent that you have the right to submit your User Content and that it does not violate any third-party rights, applicable laws, or these Terms. We may remove or modify User Content at our discretion without notice.</p>
        </section>

        <section id="prohibited">
          <h2 className="text-2xl font-semibold text-white">5. Prohibited Conduct</h2>
          <p className="mt-3">You agree not to:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Post false, misleading, or fraudulent listings or information</li>
            <li>Harass, threaten, or abuse other users</li>
            <li>Use automated tools, bots, or scrapers without written permission</li>
            <li>Post spam, unsolicited advertising, or chain messages</li>
            <li>List or facilitate the sale of illegal goods or services</li>
            <li>Circumvent platform security, access controls, or rate limits</li>
            <li>Impersonate another person or entity</li>
            <li>Violate any applicable federal, state, or local law or regulation</li>
          </ul>
        </section>

        <section id="ip">
          <h2 className="text-2xl font-semibold text-white">6. Intellectual Property</h2>
          <p className="mt-3">The platform, including its design, code, logos, and original content, is the property of Kenai Peninsula Network / Kenai Borough LLC and is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or reverse engineer any part of the platform without written permission.</p>
        </section>

        <section id="third-party">
          <h2 className="text-2xl font-semibold text-white">7. Third-Party Services</h2>
          <p className="mt-3">The platform may integrate with or link to third-party services, including Supabase (authentication and database), Stripe (payment processing when available), mapping services, and analytics providers. Your use of third-party services is governed by their respective terms and privacy policies. We are not responsible for the availability, accuracy, or practices of third-party services.</p>
        </section>

        
          <h2 className="text-2xl font-semibold text-white" id="real-estate">8. Real Estate Disclaimers</h2>
          <p className="mt-3">Kenai Home Sales is not a licensed real estate brokerage and does not provide real estate advice, appraisals, or legal counsel. All FSBO sellers are solely responsible for compliance with Alaska real estate disclosure laws, including the Alaska Residential Real Property Transfer Disclosure Statement under AS 34.70.</p>
          <p className="mt-3">The platform does not guarantee the accuracy of any listing information, including property condition, legal description, title status, boundary surveys, zoning, or structural assessments. Buyers should conduct their own due diligence, including obtaining independent title searches, home inspections, and surveys. Users are strongly encouraged to consult a licensed Alaska attorney before entering any real estate transaction.</p>

        <section id="disclaimers">
          <h2 className="text-2xl font-semibold text-white">9. Disclaimers and Limitation of Liability</h2>
          <p className="mt-3">THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
          <p className="mt-3">TO THE MAXIMUM EXTENT PERMITTED BY LAW, KENAI PENINSULA NETWORK / KENAI BOROUGH LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, ARISING FROM YOUR USE OF THE PLATFORM.</p>
          <p className="mt-3">Our total liability for any claim arising from these Terms or your use of the platform shall not exceed the amount you paid us, if any, in the twelve (12) months preceding the claim.</p>
        </section>

        <section id="intermediary">
          <h2 className="text-2xl font-semibold text-white">10. Platform as Intermediary</h2>
          <p className="mt-3">Kenai Home Sales operates as a technology platform that facilitates connections between users. We are not a party to any transaction between users. We do not guarantee the accuracy of listings, the quality of goods or services, the identity or qualifications of users, or the completion of any transaction. All dealings between users are solely between those parties.</p>
        </section>

        <section id="indemnification">
          <h2 className="text-2xl font-semibold text-white">11. Indemnification</h2>
          <p className="mt-3">You agree to indemnify, defend, and hold harmless Kenai Peninsula Network / Kenai Borough LLC, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable attorney fees) arising from your use of the platform, your violation of these Terms, or your violation of any rights of a third party.</p>
        </section>

        <section id="disputes">
          <h2 className="text-2xl font-semibold text-white">12. Dispute Resolution</h2>
          <p className="mt-3">Any disputes arising from or relating to these Terms or your use of the platform shall first be attempted to be resolved through informal negotiation. If informal resolution fails, disputes shall be resolved through binding arbitration administered in the Kenai Peninsula Borough, State of Alaska, in accordance with applicable arbitration rules.</p>
          <p className="mt-3">You agree that any dispute resolution proceedings will be conducted on an individual basis and not as a class action, collective action, or representative proceeding.</p>
        </section>

        <section id="modifications">
          <h2 className="text-2xl font-semibold text-white">13. Modification of Terms</h2>
          <p className="mt-3">We reserve the right to modify these Terms at any time. Material changes will be communicated by posting an updated version on the platform with a revised effective date. Your continued use of the platform following any changes constitutes acceptance of the updated Terms.</p>
        </section>

        <section id="termination">
          <h2 className="text-2xl font-semibold text-white">14. Termination</h2>
          <p className="mt-3">We may suspend or terminate your access to the platform at any time, with or without cause, and with or without notice. Upon termination, your right to use the platform ceases immediately. Provisions that by their nature should survive termination (including disclaimers, limitations of liability, and indemnification) shall survive.</p>
        </section>

        <section id="governing-law">
          <h2 className="text-2xl font-semibold text-white">15. Governing Law</h2>
          <p className="mt-3">These Terms shall be governed by and construed in accordance with the laws of the State of Alaska, without regard to conflict of law principles. Any legal proceedings shall be brought in the courts of the Kenai Peninsula Borough, Third Judicial District, State of Alaska.</p>
        </section>

        <section id="contact">
          <h2 className="text-2xl font-semibold text-white">16. Contact Information</h2>
          <p className="mt-3">If you have questions about these Terms, please contact us at:</p>
          <ul className="mt-2 space-y-1">
            <li>Email: <a href="mailto:legal@kenaiborough.com" className="text-sky-400 hover:underline">legal@kenaiborough.com</a></li>
            <li>Website: <a href="https://kenaihomesales.com" className="text-sky-400 hover:underline">kenaihomesales.com</a></li>
            <li>Entity: Kenai Peninsula Network / Kenai Borough LLC</li>
            <li>Jurisdiction: Kenai Peninsula Borough, Alaska</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
