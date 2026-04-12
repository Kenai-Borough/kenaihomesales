const networkLinks = [
  { label: "Kenai Borough", href: "https://kenaiborough.com" },
  { label: "Kenai Borough Realty", href: "https://kenaiboroughrealty.com" },
  { label: "Kenai Land Sales", href: "https://kenailandsales.com" },
  { label: "Kenai Peninsula Rentals", href: "https://kenaipeninsularentals.com" },
  { label: "Kenai Home Sales", href: "https://kenaihomesales.com" },
  { label: "Kenai Auto Sales", href: "https://kenaiautosales.com" },
  { label: "Kenai Listings", href: "https://kenailistings.com" },
  { label: "Kenai News", href: "https://kenainews.com" },
] as const

export function KenaiNetworkBanner() {
  return (
    <div className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Kenai Network</p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">Part of the Kenai Peninsula Network</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {networkLinks.map((site) => (
            <a key={site.href} href={site.href} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:text-white">
              {site.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
