import { Link } from 'react-router-dom';

export default function RealEstateDisclaimer() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300 hover:underline">&larr; Back to home</Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">Real Estate Disclaimer</h1>
      <p className="mt-2 text-sm text-slate-400">Effective: April 2026</p>

      <nav className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Table of Contents</h2>
        <ol className="mt-3 list-decimal list-inside space-y-1 text-sm text-sky-400">
          <li><a href="#not-a-brokerage" className="hover:text-sky-300 hover:underline">Not a Licensed Brokerage</a></li>
          <li><a href="#seller-responsibility" className="hover:text-sky-300 hover:underline">Seller Responsibilities</a></li>
          <li><a href="#buyer-diligence" className="hover:text-sky-300 hover:underline">Buyer Due Diligence</a></li>
          <li><a href="#no-advice" className="hover:text-sky-300 hover:underline">No Legal, Tax, or Financial Advice</a></li>
          <li><a href="#escrow" className="hover:text-sky-300 hover:underline">Escrow and Closing</a></li>
          <li><a href="#information-accuracy" className="hover:text-sky-300 hover:underline">Information Accuracy</a></li>
          <li><a href="#resources" className="hover:text-sky-300 hover:underline">Alaska Resources</a></li>
        </ol>
      </nav>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-slate-300">
        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-5">
          <p className="font-semibold text-amber-200">Important Notice</p>
          <p className="mt-2">Kenai Home Sales is a technology platform that provides tools and resources for For Sale By Owner (FSBO) real estate transactions. We are not a licensed real estate brokerage, and using our platform does not create a broker-client or agency relationship of any kind.</p>
        </div>

        <section id="not-a-brokerage">
          <h2 className="text-2xl font-semibold text-white">1. Not a Licensed Brokerage</h2>
          <p className="mt-3">Kenai Home Sales (kenaihomesales.com) operates as a technology platform and marketplace, not as a licensed real estate brokerage, real estate agent, or real estate advisor. We do not hold a real estate license issued by the Alaska Real Estate Commission, and no employee, contractor, or representative of Kenai Home Sales is acting in the capacity of a licensed real estate professional on behalf of any user.</p>
          <p className="mt-3">The platform provides tools for sellers to create and manage listings and for buyers to browse and inquire. The facilitation of these connections does not constitute real estate brokerage services.</p>
        </section>

        <section id="seller-responsibility">
          <h2 className="text-2xl font-semibold text-white">2. Seller Responsibilities</h2>
          <p className="mt-3">Sellers using the FSBO platform are solely responsible for:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Compliance with all Alaska real estate laws, including Alaska Statutes Title 34</li>
            <li>Completing and providing the Alaska Residential Real Property Transfer Disclosure Statement as required under <strong className="text-white">AS 34.70.010</strong></li>
            <li>Accurate representation of property condition, boundaries, encumbrances, and defects</li>
            <li>Disclosure of all material facts known to the seller</li>
            <li>Compliance with lead-based paint disclosure requirements for pre-1978 properties</li>
            <li>Compliance with any applicable local disclosure ordinances</li>
          </ul>
        </section>

        <section id="buyer-diligence">
          <h2 className="text-2xl font-semibold text-white">3. Buyer Due Diligence</h2>
          <p className="mt-3">Buyers are strongly encouraged to conduct their own independent due diligence before purchasing any property, including but not limited to:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li><strong className="text-white">Title search:</strong> Obtain a professional title search and title insurance to verify clear ownership and identify any liens, easements, or encumbrances</li>
            <li><strong className="text-white">Property inspection:</strong> Hire a licensed home inspector to assess the condition of the property, including structural, mechanical, and environmental factors</li>
            <li><strong className="text-white">Boundary survey:</strong> Commission a licensed land surveyor to verify property boundaries and legal descriptions</li>
            <li><strong className="text-white">Environmental assessment:</strong> Assess for environmental hazards, including flood zones, contamination, and protected areas</li>
            <li><strong className="text-white">Zoning verification:</strong> Verify current zoning, land use restrictions, and building code compliance with the Kenai Peninsula Borough Planning Department</li>
          </ul>
        </section>

        <section id="no-advice">
          <h2 className="text-2xl font-semibold text-white">4. No Legal, Tax, or Financial Advice</h2>
          <p className="mt-3">Kenai Home Sales does not provide legal, tax, financial, or investment advice. All information on the platform, including articles, guides, and resources, is for general informational purposes only and should not be relied upon as professional advice. Users should consult with qualified professionals, including licensed Alaska attorneys, certified public accountants, and financial advisors, before making real estate decisions.</p>
        </section>

        <section id="escrow">
          <h2 className="text-2xl font-semibold text-white">5. Escrow and Closing</h2>
          <p className="mt-3">All escrow and closing services are provided by independent third-party title companies and escrow agents. Kenai Home Sales does not handle earnest money deposits, closing funds, or any financial transactions related to real estate transfers. Buyers and sellers should select a reputable title company licensed to operate in Alaska.</p>
        </section>

        <section id="information-accuracy">
          <h2 className="text-2xl font-semibold text-white">6. Information Accuracy</h2>
          <p className="mt-3">All listing information, including property descriptions, photographs, measurements, pricing, and condition reports, is provided by individual sellers and has not been independently verified by Kenai Home Sales. We make no representations or warranties regarding the accuracy, completeness, or reliability of any listing information. Discrepancies between listing information and actual property conditions may exist.</p>
        </section>

        <section id="resources">
          <h2 className="text-2xl font-semibold text-white">7. Alaska Resources</h2>
          <p className="mt-3">For additional information about real estate transactions in Alaska, the following resources may be helpful:</p>
          <ul className="mt-2 space-y-2">
            <li><a href="https://www.prior.prior.prior.prior.prior.prior.prior.commerce.alaska.gov/web/cbpl/professionallicensing/prior.prior.prior.RealEstateCommission" className="hidden" aria-hidden="true">hidden</a><a href="https://www.commerce.alaska.gov/web/cbpl/ProfessionalLicensing/RealEstateCommission.aspx" className="text-sky-400 hover:underline" target="_blank" rel="noreferrer">Alaska Real Estate Commission</a> — Licensing, regulations, and consumer resources</li>
            <li><a href="https://dnr.alaska.gov/" className="text-sky-400 hover:underline" target="_blank" rel="noreferrer">Alaska Department of Natural Resources (DNR)</a> — Land records, surveys, and public land information</li>
            <li><a href="https://www.kpb.us/assessor-home" className="text-sky-400 hover:underline" target="_blank" rel="noreferrer">Kenai Peninsula Borough Assessor</a> — Property tax information, assessed values, and parcel data</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
