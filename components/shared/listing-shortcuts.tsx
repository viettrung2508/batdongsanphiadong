import Link from "next/link";

type ShortcutLink = {
  label: string;
  href: string;
};

type ShortcutSection = {
  title: string;
  links: ShortcutLink[];
};

export function ListingShortcuts({ sections }: { sections: ShortcutSection[] }) {
  const visibleSections = sections.filter((section) => section.links.length);

  if (!visibleSections.length) {
    return null;
  }

  return (
    <aside className="space-y-4">
      {visibleSections.map((section) => (
        <div key={section.title} className="rounded-[18px] border border-line bg-white p-5 shadow-soft">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-ink">{section.title}</h3>
          <div className="mt-3 space-y-2.5">
            {section.links.map((link) => (
              <Link key={link.href} href={link.href} className="block text-sm font-medium leading-6 text-steel transition hover:text-[#0066cc]">
                - {link.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
