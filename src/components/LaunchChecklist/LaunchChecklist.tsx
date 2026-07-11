import { useMemo, useState } from 'react';

export type LaunchChecklistItem = {
  id: string;
  label: string;
  description: string;
  defaultComplete?: boolean;
};

export type LaunchChecklistProps = {
  items?: LaunchChecklistItem[];
};

export const defaultLaunchChecklistItems: LaunchChecklistItem[] = [
  {
    id: 'astro',
    label: 'Astro page shell',
    description:
      'File-based routes and layouts provide the static site foundation.',
  },
  {
    id: 'react',
    label: 'React island',
    description:
      'Interactive UI hydrates only where the page needs client behavior.',
  },
  {
    id: 'tailwind',
    label: 'Tailwind styling',
    description: 'Utility classes keep the starter interface fast to adapt.',
  },
  {
    id: 'cloudflare',
    label: 'Cloudflare deployment target',
    description:
      'The project is configured for Cloudflare Pages-compatible builds.',
  },
  {
    id: 'tests',
    label: 'Tested at every layer',
    description:
      'Vitest, Storybook, and Playwright cover the starter experience.',
  },
];

export function LaunchChecklist({
  items = defaultLaunchChecklistItems,
}: LaunchChecklistProps) {
  const initialCompletedIds = useMemo(
    () => items.filter((item) => item.defaultComplete).map((item) => item.id),
    [items],
  );
  const [completedIds, setCompletedIds] =
    useState<string[]>(initialCompletedIds);

  const completedCount = completedIds.length;
  const totalCount = items.length;

  function toggleItem(id: string) {
    setCompletedIds((current) =>
      current.includes(id)
        ? current.filter((completedId) => completedId !== id)
        : [...current, id],
    );
  }

  return (
    <section
      aria-labelledby="launch-checklist-heading"
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-700">
            Interactive React island
          </p>
          <h2
            id="launch-checklist-heading"
            className="text-2xl font-semibold text-slate-950"
          >
            Launch checklist
          </h2>
        </div>
        <p className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {completedCount} of {totalCount} complete
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {items.map((item) => {
          const isComplete = completedIds.includes(item.id);

          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={isComplete}
              onClick={() => toggleItem(item.id)}
              className="grid gap-1 rounded-md border border-slate-200 px-4 py-3 text-left transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <span className="flex items-center gap-3 font-medium text-slate-950">
                <span
                  aria-hidden="true"
                  className={`flex size-5 items-center justify-center rounded-full border text-xs ${
                    isComplete
                      ? 'border-sky-600 bg-sky-600 text-white'
                      : 'border-slate-300 bg-white text-transparent'
                  }`}
                >
                  ✓
                </span>
                {item.label}
              </span>
              <span className="pl-8 text-sm leading-6 text-slate-600">
                {item.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
