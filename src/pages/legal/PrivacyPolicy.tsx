import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300 hover:underline">&larr; Back to home</Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-400">Effective: April 2026</p>

      <nav className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Table of Contents</h2>
        <ol className="mt-3 list-decimal list-inside space-y-1 text-sm text-sky-400">
          <li><a href="#information-collected" className="hover:text-sky-300 hover:underline">Information We Collect</a></li>
          <li><a href="#how-we-use" className="hover:text-sky-300 hover:underline">How We Use Your Information</a></li>
          <li><a href="#sharing" className="hover:text-sky-300 hover:underline">Information Sharing</a></li>
          <li><a href="#kenai-network" className="hover:text-sky-300 hover:underline">Kenai Peninsula Network</a></li>
          <li><a href="#cookies" className="hover:text-sky-300 hover:underline">Cookies and Tracking</a></li>
          <li><a href="#retention" className="hover:text-sky-300 hover:underline">Data Retention</a></li>
          <li><a href="#rights" className="hover:text-sky-300 hover:underline">Your Rights</a></li>
          <li><a href="#ccpa" className="hover:text-sky-300 hover:underline">California Privacy Rights (CCPA)</a></li>
          <li><a href="#gdpr" className="hover:text-sky-300 hover:underline">European Privacy Rights (GDPR)</a></li>
          <li><a href="#alaska" className="hover:text-sky-300 hover:underline">Alaska Privacy Protections</a></li>
          <li><a href="#children" className="hover:text-sky-300 hover:underline">Children Under 13</a></li>
          <li><a href="#security" className="hover:text-sky-300 hover:underline">Security</a></li>
          <li><a href="#changes" className="hover:text-sky-300 hover:underline">Changes to This Policy</a></li>
          <li><a href="#contact" className="hover:text-sky-300 hover:underline">Contact Us</a></li>
        </ol>
      </nav>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-slate-300">
        <section id="information-collected">
          <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
          <p className="mt-3"><strong className="text-white">Information you provide:</strong> Name, email address, phone number, account credentials, profile information, listing content (text, images, descriptions), messages, and any other information you submit through the platform.</p>
          <p className="mt-3"><strong className="text-white">Information collected automatically:</strong> IP address, browser type and version, device type, operating system, referring URL, pages visited, time and date of visits, and general location data derived from your IP address.</p>
          <p className="mt-3"><strong className="text-white">Information from third parties:</strong> Authentication data from Supabase, payment information processed by Stripe (when available), and any data shared by linked services you connect to your account.</p>
        </section>

        <section id="how-we-use">
          <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
          <p className="mt-3">We use the information we collect to:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Provide, maintain, and improve the platform and its features</li>
            <li>Create and manage your account across the Kenai Peninsula Network</li>
            <li>Facilitate communication between users (e.g., listing inquiries, messaging)</li>
            <li>Process transactions and send related notifications</li>
            <li>Send administrative notices, security alerts, and support messages</li>
            <li>Personalize your experience and provide content recommendations</li>
            <li>Detect, prevent, and address fraud, abuse, and security issues</li>
            <li>Comply with legal obligations and enforce our Terms of Service</li>
            <li>Analyze usage patterns to improve our services</li>
          </ul>
        </section>

        <section id="sharing">
          <h2 className="text-2xl font-semibold text-white">3. Information Sharing</h2>
          <p className="mt-3">We do not sell your personal information. We may share your information with:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li><strong className="text-white">Other users:</strong> Profile information and listing content you choose to make public</li>
            <li><strong className="text-white">Service providers:</strong> Third-party vendors who assist in operating the platform (e.g., Supabase for authentication, Stripe for payments, hosting providers)</li>
            <li><strong className="text-white">Kenai Peninsula Network sites:</strong> Account information shared across affiliated sites for unified login</li>
            <li><strong className="text-white">Legal requirements:</strong> When required by law, court order, or governmental authority</li>
            <li><strong className="text-white">Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        <section id="kenai-network">
          <h2 className="text-2xl font-semibold text-white">4. Kenai Peninsula Network</h2>
          <div className="mt-3 rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4">
            <p>Your account information is shared across the Kenai Peninsula Network of sites (kenaiborough.com, kenaiboroughrealty.com, kenailandsales.com, kenaipeninsularentals.com, kenaihomesales.com, kenaiautosales.com, kenailistings.com) to provide a unified login experience. Your activity on each site is kept separate and is not shared across sites unless you explicitly choose to do so.</p>
          </div>
        </section>

        <section id="cookies">
          <h2 className="text-2xl font-semibold text-white">5. Cookies and Tracking</h2>
          <p className="mt-3">We use cookies and similar technologies for authentication, preferences (such as dark mode), and analytics. For detailed information about our cookie practices, please see our <Link to="/cookies" className="text-sky-400 hover:underline">Cookie Policy</Link>.</p>
        </section>

        <section id="retention">
          <h2 className="text-2xl font-semibold text-white">6. Data Retention</h2>
          <p className="mt-3">We retain your personal information for as long as your account is active or as needed to provide you services. We may retain certain information after account deletion for legitimate business purposes, including fraud prevention, legal compliance, and dispute resolution. Listing content may be retained in anonymized form for analytics purposes.</p>
        </section>

        <section id="rights">
          <h2 className="text-2xl font-semibold text-white">7. Your Rights</h2>
          <p className="mt-3">Depending on your location, you may have the right to:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Access the personal information we hold about you</li>
            <li>Correct inaccurate or incomplete personal information</li>
            <li>Delete your personal information (subject to legal obligations)</li>
            <li>Object to or restrict certain processing of your information</li>
            <li>Data portability (receive your data in a structured, machine-readable format)</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
          <p className="mt-3">To exercise these rights, please contact us at <a href="mailto:privacy@kenaihomesales.com" className="text-sky-400 hover:underline">privacy@kenaihomesales.com</a>.</p>
        </section>

        <section id="ccpa">
          <h2 className="text-2xl font-semibold text-white">8. California Privacy Rights (CCPA)</h2>
          <p className="mt-3">If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected, the right to request deletion, and the right to opt out of the sale of personal information. We do not sell personal information. To submit a CCPA request, email <a href="mailto:privacy@kenaihomesales.com" className="text-sky-400 hover:underline">privacy@kenaihomesales.com</a>.</p>
        </section>

        <section id="gdpr">
          <h2 className="text-2xl font-semibold text-white">9. European Privacy Rights (GDPR)</h2>
          <p className="mt-3">If you are located in the European Economic Area (EEA) or the United Kingdom, you have rights under the General Data Protection Regulation (GDPR), including rights of access, rectification, erasure, restriction of processing, data portability, and the right to object. Our legal bases for processing include consent, contract performance, legitimate interests, and legal obligations. Contact <a href="mailto:privacy@kenaihomesales.com" className="text-sky-400 hover:underline">privacy@kenaihomesales.com</a> to exercise your rights.</p>
        </section>

        <section id="alaska">
          <h2 className="text-2xl font-semibold text-white">10. Alaska Privacy Protections</h2>
          <p className="mt-3">We comply with the Alaska Personal Information Protection Act (AS 45.48). In the event of a data breach involving your personal information, we will notify affected individuals and the Alaska Attorney General as required by Alaska law. We implement reasonable security measures to protect personal information from unauthorized access, disclosure, alteration, or destruction.</p>
        </section>

        <section id="children">
          <h2 className="text-2xl font-semibold text-white">11. Children Under 13</h2>
          <p className="mt-3">The platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided personal information, we will promptly delete it. If you believe a child under 13 has submitted personal information through our platform, please contact us immediately.</p>
        </section>

        <section id="security">
          <h2 className="text-2xl font-semibold text-white">12. Security</h2>
          <p className="mt-3">We implement industry-standard security measures to protect your information, including encryption in transit (TLS/SSL), secure authentication through Supabase, and access controls. However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security of your data.</p>
        </section>

        <section id="changes">
          <h2 className="text-2xl font-semibold text-white">13. Changes to This Policy</h2>
          <p className="mt-3">We may update this Privacy Policy from time to time. Material changes will be communicated by posting an updated version on the platform with a revised effective date. We encourage you to review this policy periodically.</p>
        </section>

        <section id="contact">
          <h2 className="text-2xl font-semibold text-white">14. Contact Us</h2>
          <p className="mt-3">For privacy-related questions or requests:</p>
          <ul className="mt-2 space-y-1">
            <li>Privacy inquiries: <a href="mailto:privacy@kenaihomesales.com" className="text-sky-400 hover:underline">privacy@kenaihomesales.com</a></li>
            <li>General legal: <a href="mailto:legal@kenaiborough.com" className="text-sky-400 hover:underline">legal@kenaiborough.com</a></li>
            <li>Entity: Kenai Peninsula Network / Kenai Borough LLC</li>
            <li>Jurisdiction: Kenai Peninsula Borough, Alaska</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
