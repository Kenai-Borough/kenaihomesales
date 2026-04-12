import { Link } from 'react-router-dom';

export default function CookiePolicy() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-sky-400 hover:text-sky-300 hover:underline">&larr; Back to home</Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-white">Cookie Policy</h1>
      <p className="mt-2 text-sm text-slate-400">Effective: April 2026</p>

      <nav className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Table of Contents</h2>
        <ol className="mt-3 list-decimal list-inside space-y-1 text-sm text-sky-400">
          <li><a href="#what-are-cookies" className="hover:text-sky-300 hover:underline">What Are Cookies</a></li>
          <li><a href="#essential" className="hover:text-sky-300 hover:underline">Essential Cookies</a></li>
          <li><a href="#functional" className="hover:text-sky-300 hover:underline">Functional Cookies</a></li>
          <li><a href="#analytics" className="hover:text-sky-300 hover:underline">Analytics Cookies</a></li>
          <li><a href="#third-party" className="hover:text-sky-300 hover:underline">Third-Party Cookies</a></li>
          <li><a href="#management" className="hover:text-sky-300 hover:underline">Managing Cookies</a></li>
          <li><a href="#changes" className="hover:text-sky-300 hover:underline">Changes to This Policy</a></li>
          <li><a href="#contact" className="hover:text-sky-300 hover:underline">Contact Us</a></li>
        </ol>
      </nav>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-slate-300">
        <section id="what-are-cookies">
          <h2 className="text-2xl font-semibold text-white">1. What Are Cookies</h2>
          <p className="mt-3">Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, keep you signed in, and understand how you interact with the site. Kenai Home Sales uses cookies and similar technologies (such as localStorage) to provide a better user experience.</p>
        </section>

        <section id="essential">
          <h2 className="text-2xl font-semibold text-white">2. Essential Cookies</h2>
          <p className="mt-3">These cookies are necessary for the platform to function and cannot be disabled. They include:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li><strong className="text-white">Authentication session cookies:</strong> Managed by Supabase to keep you signed in securely across page loads and sessions</li>
            <li><strong className="text-white">CSRF tokens:</strong> Protect against cross-site request forgery attacks</li>
            <li><strong className="text-white">Session state:</strong> Maintain your session state as you navigate the platform</li>
          </ul>
        </section>

        <section id="functional">
          <h2 className="text-2xl font-semibold text-white">3. Functional Cookies</h2>
          <p className="mt-3">These cookies remember your preferences to enhance your experience:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li><strong className="text-white">Theme preference:</strong> Stores your dark mode or light mode selection (localStorage)</li>
            <li><strong className="text-white">Search preferences:</strong> Remembers your recent search filters and sort preferences</li>
            <li><strong className="text-white">UI state:</strong> Remembers collapsed panels, view modes, and other interface preferences</li>
          </ul>
        </section>

        <section id="analytics">
          <h2 className="text-2xl font-semibold text-white">4. Analytics Cookies</h2>
          <p className="mt-3">We may use analytics cookies to understand how visitors interact with the platform. These cookies collect information in an aggregated, anonymous form. If analytics services are enabled, they help us identify popular content, detect usability issues, and improve the platform. You may opt out of analytics cookies through your browser settings.</p>
        </section>

        <section id="third-party">
          <h2 className="text-2xl font-semibold text-white">5. Third-Party Cookies</h2>
          <p className="mt-3">The following third-party services may set cookies on your device:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li><strong className="text-white">Supabase:</strong> Authentication and session management cookies required for secure sign-in across the Kenai Peninsula Network</li>
            <li><strong className="text-white">Stripe:</strong> Payment processing cookies set when payment features are active (fraud prevention, session security)</li>
            <li><strong className="text-white">Mapping services:</strong> Cookies from map tile providers when interactive maps are displayed</li>
          </ul>
          <p className="mt-3">Third-party cookies are governed by the respective privacy policies of those services.</p>
        </section>

        <section id="management">
          <h2 className="text-2xl font-semibold text-white">6. Managing Cookies</h2>
          <p className="mt-3">Most web browsers allow you to manage cookies through their settings. You can typically:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>View and delete existing cookies</li>
            <li>Block all cookies or only third-party cookies</li>
            <li>Set preferences for specific websites</li>
            <li>Configure your browser to notify you when cookies are set</li>
          </ul>
          <p className="mt-3">Please note that disabling essential cookies may prevent you from signing in or using core features of the platform. To clear localStorage preferences, use your browser's developer tools or clear site data.</p>
        </section>

        <section id="changes">
          <h2 className="text-2xl font-semibold text-white">7. Changes to This Policy</h2>
          <p className="mt-3">We may update this Cookie Policy as our platform evolves or as regulations change. Updates will be posted on this page with a revised effective date.</p>
        </section>

        <section id="contact">
          <h2 className="text-2xl font-semibold text-white">8. Contact Us</h2>
          <p className="mt-3">Questions about our use of cookies? Contact us at <a href="mailto:privacy@kenaihomesales.com" className="text-sky-400 hover:underline">privacy@kenaihomesales.com</a> or <a href="mailto:legal@kenaiborough.com" className="text-sky-400 hover:underline">legal@kenaiborough.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
