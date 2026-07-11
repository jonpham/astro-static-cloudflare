export type PageTreeLink = {
  href: string;
  label: string;
  description: string;
};

export type PageTreeProps = {
  links?: PageTreeLink[];
};

export const defaultPageTreeLinks: PageTreeLink[] = [
  {
    href: '/404',
    label: '404',
    description: 'Custom not-found route for missing pages.',
  },
  {
    href: '/error',
    label: 'Error',
    description: 'Generic error route for failure states.',
  },
];

export function PageTree({ links = defaultPageTreeLinks }: PageTreeProps) {
  return (
    <nav
      aria-label="Demo routes"
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <p className="text-sm font-medium text-sky-700">Astro routing</p>
        <h2 className="text-2xl font-semibold text-slate-950">Page tree</h2>
      </div>
      <ul className="mt-5 grid gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="block rounded-md border border-slate-200 px-4 py-3 transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <span className="font-medium text-slate-950">{link.label}</span>
              <span className="mt-1 block text-sm leading-6 text-slate-600">
                {link.description}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
