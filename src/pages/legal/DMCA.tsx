import { Link } from 'react-router-dom';

export default function DMCA() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300 hover:underline">&larr; Back to home</Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">DMCA / Copyright Policy</h1>
      <p className="mt-2 text-sm text-slate-400">Effective: April 2026</p>

      <nav className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Table of Contents</h2>
        <ol className="mt-3 list-decimal list-inside space-y-1 text-sm text-sky-400">
          <li><a href="#overview" className="hover:text-sky-300 hover:underline">Overview</a></li>
          <li><a href="#reporting" className="hover:text-sky-300 hover:underline">Reporting Copyright Infringement</a></li>
          <li><a href="#counter-notification" className="hover:text-sky-300 hover:underline">Counter-Notification</a></li>
          <li><a href="#repeat-infringers" className="hover:text-sky-300 hover:underline">Repeat Infringer Policy</a></li>
          <li><a href="#agent" className="hover:text-sky-300 hover:underline">DMCA Agent</a></li>
        </ol>
      </nav>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-slate-300">
        <section id="overview">
          <h2 className="text-2xl font-semibold text-white">1. Overview</h2>
          <p className="mt-3">Kenai Home Sales (kenaihomesales.com) respects the intellectual property rights of others and complies with the Digital Millennium Copyright Act (DMCA), 17 U.S.C. § 512. We respond promptly to notices of alleged copyright infringement that comply with the DMCA and other applicable intellectual property laws.</p>
          <p className="mt-3">If you believe that your copyrighted work has been copied and posted on our platform in a way that constitutes copyright infringement, please submit a DMCA takedown notice as described below.</p>
        </section>

        <section id="reporting">
          <h2 className="text-2xl font-semibold text-white">2. Reporting Copyright Infringement</h2>
          <p className="mt-3">To submit a valid DMCA takedown notice, send a written communication to our designated DMCA Agent that includes:</p>
          <ol className="mt-2 list-decimal list-inside space-y-2">
            <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf</li>
            <li>Identification of the copyrighted work claimed to have been infringed (or a representative list if multiple works are involved)</li>
            <li>Identification of the material that is claimed to be infringing and information reasonably sufficient to locate the material on the platform (e.g., URL or listing ID)</li>
            <li>Your contact information, including name, address, telephone number, and email address</li>
            <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law</li>
            <li>A statement, made under penalty of perjury, that the information in the notification is accurate and that you are the copyright owner or authorized to act on the owner's behalf</li>
          </ol>
        </section>

        <section id="counter-notification">
          <h2 className="text-2xl font-semibold text-white">3. Counter-Notification</h2>
          <p className="mt-3">If you believe your content was removed in error or that you have authorization to use the material, you may submit a counter-notification to our DMCA Agent that includes:</p>
          <ol className="mt-2 list-decimal list-inside space-y-2">
            <li>Your physical or electronic signature</li>
            <li>Identification of the material that has been removed and the location where it appeared before removal</li>
            <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification</li>
            <li>Your name, address, and telephone number, and a statement that you consent to the jurisdiction of the federal courts in the District of Alaska and will accept service of process from the person who provided the original DMCA notice</li>
          </ol>
          <p className="mt-3">Upon receiving a valid counter-notification, we will forward it to the original complainant and may restore the removed material within 10-14 business days unless the complainant initiates a court action.</p>
        </section>

        <section id="repeat-infringers">
          <h2 className="text-2xl font-semibold text-white">4. Repeat Infringer Policy</h2>
          <p className="mt-3">In accordance with the DMCA, we maintain a policy of terminating the accounts of users who are repeat copyright infringers. If a user receives multiple valid DMCA takedown notices, their account may be permanently suspended or terminated at our discretion.</p>
        </section>

        <section id="agent">
          <h2 className="text-2xl font-semibold text-white">5. DMCA Agent</h2>
          <p className="mt-3">DMCA notices and counter-notifications should be sent to our designated agent:</p>
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p><strong className="text-white">DMCA Agent</strong></p>
            <p>Kenai Peninsula Network / Kenai Borough LLC</p>
            <p>Email: <a href="mailto:legal@kenaiborough.com" className="text-sky-400 hover:underline">legal@kenaiborough.com</a></p>
            <p>Subject line: DMCA Notice — kenaihomesales.com</p>
            <p>Jurisdiction: Kenai Peninsula Borough, Alaska</p>
          </div>
          <p className="mt-3">Please note that under 17 U.S.C. § 512(f), any person who knowingly materially misrepresents that material is infringing may be subject to liability for damages.</p>
        </section>
      </div>
    </div>
  );
}
