import { Link } from 'react-router-dom';

export default function FairHousing() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300 hover:underline">&larr; Back to home</Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">Fair Housing Policy</h1>
      <p className="mt-2 text-sm text-slate-400">Effective: April 2026</p>

      <nav className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Table of Contents</h2>
        <ol className="mt-3 list-decimal list-inside space-y-1 text-sm text-sky-400">
          <li><a href="#commitment" className="hover:text-sky-300 hover:underline">Our Commitment</a></li>
          <li><a href="#federal-law" className="hover:text-sky-300 hover:underline">Federal Fair Housing Act</a></li>
          <li><a href="#alaska-law" className="hover:text-sky-300 hover:underline">Alaska Human Rights Law</a></li>
          <li><a href="#protected-classes" className="hover:text-sky-300 hover:underline">Protected Classes</a></li>
          <li><a href="#prohibited-practices" className="hover:text-sky-300 hover:underline">Prohibited Practices</a></li>
          <li><a href="#reporting" className="hover:text-sky-300 hover:underline">Reporting Discrimination</a></li>
          <li><a href="#equal-opportunity" className="hover:text-sky-300 hover:underline">Equal Opportunity</a></li>
        </ol>
      </nav>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-slate-300">
        <section id="commitment">
          <h2 className="text-2xl font-semibold text-white">1. Our Commitment</h2>
          <p className="mt-3">Kenai Home Sales (kenaihomesales.com) is committed to promoting fair housing practices and ensuring equal access to housing opportunities for all users. We believe that every person has the right to choose where they live, free from discrimination. All listings, communications, and transactions on our platform must comply with applicable fair housing laws.</p>
        </section>

        <section id="federal-law">
          <h2 className="text-2xl font-semibold text-white">2. Federal Fair Housing Act</h2>
          <p className="mt-3">The Fair Housing Act (Title VIII of the Civil Rights Act of 1968, as amended, 42 U.S.C. §§ 3601-3619) prohibits discrimination in the sale, rental, and financing of housing based on race, color, national origin, religion, sex (including gender identity and sexual orientation), familial status, and disability. This applies to residential real estate transactions, advertising, and lending practices.</p>
        </section>

        <section id="alaska-law">
          <h2 className="text-2xl font-semibold text-white">3. Alaska Human Rights Law</h2>
          <p className="mt-3">The Alaska Human Rights Law (AS 18.80) provides additional protections beyond federal law. It prohibits discrimination in housing based on race, religion, color, national origin, sex, physical or mental disability, marital status, changes in marital status, pregnancy, and parentage. Alaska law applies to the sale, lease, and rental of real property.</p>
        </section>

        <section id="protected-classes">
          <h2 className="text-2xl font-semibold text-white">4. Protected Classes</h2>
          <p className="mt-3">Under combined federal and Alaska state law, the following classes are protected from housing discrimination:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Race and color</li>
            <li>National origin</li>
            <li>Religion</li>
            <li>Sex (including gender identity and sexual orientation)</li>
            <li>Familial status (families with children under 18, pregnant persons)</li>
            <li>Disability (physical or mental)</li>
            <li>Marital status and changes in marital status</li>
            <li>Pregnancy and parentage</li>
          </ul>
        </section>

        <section id="prohibited-practices">
          <h2 className="text-2xl font-semibold text-white">5. Prohibited Practices</h2>
          <p className="mt-3">The following practices are prohibited on Kenai Home Sales:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Refusing to sell, rent, or negotiate based on a protected class</li>
            <li>Setting different terms, conditions, or privileges based on a protected class</li>
            <li>Advertising or stating a preference, limitation, or discrimination based on a protected class</li>
            <li>Falsely denying that a property is available for sale or rental</li>
            <li>Steering prospective buyers or renters toward or away from certain neighborhoods</li>
            <li>Refusing to make reasonable accommodations for persons with disabilities</li>
            <li>Retaliating against anyone who exercises their fair housing rights or files a complaint</li>
          </ul>
        </section>

        <section id="reporting">
          <h2 className="text-2xl font-semibold text-white">6. Reporting Discrimination</h2>
          <p className="mt-3">If you have experienced or witnessed housing discrimination on Kenai Home Sales, you can:</p>
          <ul className="mt-2 space-y-2">
            <li>Report it to us at <a href="mailto:legal@kenaiborough.com" className="text-sky-400 hover:underline">legal@kenaiborough.com</a></li>
            <li>File a complaint with the <a href="https://www.hud.gov/program_offices/fair_housing_equal_opp/online-complaint" className="text-sky-400 hover:underline" target="_blank" rel="noreferrer">U.S. Department of Housing and Urban Development (HUD)</a></li>
            <li>Contact the <a href="https://humanrights.alaska.gov/" className="text-sky-400 hover:underline" target="_blank" rel="noreferrer">Alaska State Commission for Human Rights</a></li>
            <li>Call the HUD Housing Discrimination Hotline: <strong className="text-white">1-800-669-9777</strong></li>
          </ul>
          <p className="mt-3">We take all reports of discrimination seriously and will investigate promptly. Violations may result in listing removal, account suspension, or permanent banning from the platform.</p>
        </section>

        <section id="equal-opportunity">
          <h2 className="text-2xl font-semibold text-white">7. Equal Opportunity</h2>
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
            <p className="text-2xl font-bold text-white">&#x2302; Equal Housing Opportunity</p>
            <p className="mt-3">Kenai Home Sales supports the Fair Housing Act and Alaska Human Rights Law. We are committed to providing equal housing opportunity to all users regardless of race, color, religion, sex, national origin, familial status, disability, marital status, pregnancy, parentage, or any other protected class.</p>
            <p className="mt-3 text-xs text-slate-400">This statement is made in accordance with the Fair Housing Act and the Alaska Human Rights Law (AS 18.80).</p>
          </div>
        </section>
      </div>
    </div>
  );
}
