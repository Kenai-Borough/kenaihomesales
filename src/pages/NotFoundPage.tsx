import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="section-shell">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="section-eyebrow">404</p>
        <h1 className="section-title mx-auto">That home page doesn’t exist yet.</h1>
        <p className="mt-5 text-sm text-slate-300">Try browsing active listings or return home to continue exploring Kenai Peninsula homes.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link className="btn-primary" to="/browse">Browse homes</Link>
          <Link className="btn-secondary" to="/">Return home</Link>
        </div>
      </div>
    </div>
  );
}
