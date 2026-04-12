import { Link } from 'react-router-dom';

export default function AcceptableUse() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300 hover:underline">&larr; Back to home</Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">Acceptable Use Policy</h1>
      <p className="mt-2 text-sm text-slate-400">Effective: April 2026</p>

      <nav className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Table of Contents</h2>
        <ol className="mt-3 list-decimal list-inside space-y-1 text-sm text-sky-400">
          <li><a href="#purpose" className="hover:text-sky-300 hover:underline">Purpose</a></li>
          <li><a href="#prohibited-content" className="hover:text-sky-300 hover:underline">Prohibited Content</a></li>
          <li><a href="#prohibited-behavior" className="hover:text-sky-300 hover:underline">Prohibited Behavior</a></li>
          <li><a href="#listing-integrity" className="hover:text-sky-300 hover:underline">Listing Integrity</a></li>
          <li><a href="#discrimination" className="hover:text-sky-300 hover:underline">Anti-Discrimination</a></li>
          <li><a href="#reporting" className="hover:text-sky-300 hover:underline">Reporting Violations</a></li>
          <li><a href="#enforcement" className="hover:text-sky-300 hover:underline">Enforcement</a></li>
          <li><a href="#contact" className="hover:text-sky-300 hover:underline">Contact</a></li>
        </ol>
      </nav>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-slate-300">
        <section id="purpose">
          <h2 className="text-2xl font-semibold text-white">1. Purpose</h2>
          <p className="mt-3">This Acceptable Use Policy ("AUP") governs your conduct on Kenai Home Sales (kenaihomesales.com). It supplements our <Link to="/terms" className="text-sky-400 hover:underline">Terms of Service</Link> and is designed to ensure a safe, honest, and respectful marketplace for all users of the Kenai Peninsula community.</p>
        </section>

        <section id="prohibited-content">
          <h2 className="text-2xl font-semibold text-white">2. Prohibited Content</h2>
          <p className="mt-3">You may not post or transmit content that:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Is fraudulent, misleading, or contains material misrepresentations</li>
            <li>Promotes illegal goods, services, or activities under federal, Alaska state, or local law</li>
            <li>Contains threats, harassment, hate speech, or incitement to violence</li>
            <li>Infringes on intellectual property rights, trademarks, or copyrights</li>
            <li>Contains malware, phishing links, or other malicious code</li>
            <li>Includes personally identifiable information of others without consent</li>
            <li>Is sexually explicit, obscene, or exploitative</li>
            <li>Promotes weapons, controlled substances, or regulated items in violation of law</li>
          </ul>
        </section>

        <section id="prohibited-behavior">
          <h2 className="text-2xl font-semibold text-white">3. Prohibited Behavior</h2>
          <p className="mt-3">You may not:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Create fraudulent listings or misrepresent items, services, or properties</li>
            <li>Spam other users with unsolicited messages, advertisements, or promotions</li>
            <li>Use bots, scrapers, or automated tools to access the platform without permission</li>
            <li>Manipulate search results, reviews, or ratings</li>
            <li>Create multiple accounts to evade bans or enforcement actions</li>
            <li>Interfere with the platform's operation or other users' experience</li>
            <li>Attempt to circumvent security measures, access controls, or rate limits</li>
            <li>Engage in price manipulation, shill bidding, or market manipulation</li>
          </ul>
        </section>

        <section id="listing-integrity">
          <h2 className="text-2xl font-semibold text-white">4. Listing Integrity</h2>
          <p className="mt-3">All listings must accurately represent the item, property, service, or offering. Photos must depict the actual item being offered. Prices must reflect genuine asking prices. Material defects, conditions, or limitations must be disclosed. Duplicate or substantially identical listings are not permitted.</p>
        </section>
        
        <section id="discrimination">
          <h2 className="text-2xl font-semibold text-white">5. Anti-Discrimination and Fair Housing</h2>
          <p className="mt-3">All listings and user interactions must comply with the Fair Housing Act (42 U.S.C. §§ 3601-3619) and the Alaska Human Rights Law (AS 18.80). Users may not discriminate in any listing, communication, or transaction based on race, color, religion, sex, national origin, familial status, disability, marital status, changes in marital status, pregnancy, parentage, sexual orientation, gender identity, or any other protected class under federal, state, or local law.</p>
          <p className="mt-3">For more information, see our <Link to="/fair-housing" className="text-sky-400 hover:underline">Fair Housing Policy</Link>.</p>
        </section>

        <section id="reporting">
          <h2 className="text-2xl font-semibold text-white">6. Reporting Violations</h2>
          <p className="mt-3">If you encounter content or behavior that violates this policy, please report it to us immediately. You can flag listings through the platform's reporting tools or contact us directly at <a href="mailto:legal@kenaiborough.com" className="text-sky-400 hover:underline">legal@kenaiborough.com</a>. All reports are reviewed and handled promptly and confidentially.</p>
        </section>

        <section id="enforcement">
          <h2 className="text-2xl font-semibold text-white">7. Enforcement</h2>
          <p className="mt-3">Violations of this AUP may result in:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Content removal without notice</li>
            <li>Temporary suspension of account privileges</li>
            <li>Permanent account termination</li>
            <li>Reporting to law enforcement when illegal activity is suspected</li>
          </ul>
          <p className="mt-3">We reserve the right to take any action we deem appropriate to enforce this policy and protect the community. Enforcement decisions are made at our sole discretion.</p>
        </section>

        <section id="contact">
          <h2 className="text-2xl font-semibold text-white">8. Contact</h2>
          <p className="mt-3">Questions about this Acceptable Use Policy? Contact <a href="mailto:legal@kenaiborough.com" className="text-sky-400 hover:underline">legal@kenaiborough.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
