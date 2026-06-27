type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="section-reveal mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title mt-2.5">{title}</h2>
      </div>
      {description ? <p className="max-w-xl text-sm leading-6 text-steel">{description}</p> : null}
    </div>
  );
}
