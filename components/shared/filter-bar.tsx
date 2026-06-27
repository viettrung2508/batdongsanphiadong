type FilterOption = {
  label: string;
  value: string;
};

type FilterField = {
  name: string;
  label: string;
  options: FilterOption[];
  defaultValue?: string;
};

type FilterBarProps = {
  action: string;
  showSearch?: boolean;
  searchName?: string;
  searchPlaceholder?: string;
  searchDefaultValue?: string;
  filters?: FilterField[];
};

export function FilterBar({
  action,
  showSearch = true,
  searchName = "search",
  searchPlaceholder = "Tìm kiếm",
  searchDefaultValue = "",
  filters = []
}: FilterBarProps) {
  const gridClass = showSearch
    ? filters.length >= 4
      ? "xl:grid-cols-[1.35fr_repeat(4,minmax(0,0.92fr))_auto]"
      : filters.length >= 3
        ? "lg:grid-cols-[1.4fr_repeat(3,1fr)_auto]"
        : filters.length === 2
          ? "lg:grid-cols-[1.4fr_repeat(2,1fr)_auto]"
          : filters.length === 1
            ? "lg:grid-cols-[1.4fr_1fr_auto]"
            : "lg:grid-cols-[1.4fr_auto]"
    : filters.length >= 4
      ? "xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]"
      : filters.length === 2
        ? "lg:grid-cols-[repeat(2,1fr)_auto]"
        : filters.length >= 3
          ? "lg:grid-cols-[repeat(3,1fr)_auto]"
          : filters.length === 1
            ? "lg:grid-cols-[1fr_auto]"
            : "lg:grid-cols-[auto]";

  const fieldClassName =
    "relative flex h-10 items-center rounded-[8px] border border-line/80 bg-white/92 px-3 text-[13px] text-ink shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition focus-within:border-navy/60 focus-within:shadow-[0_14px_30px_rgba(15,23,42,0.08)]";

  return (
    <form action={action} className="glass-card p-3.5 sm:p-4">
      <div className={`grid gap-2.5 ${gridClass}`}>
        {showSearch ? (
          <label className="grid gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-steel">Từ khóa</span>
            <span className={fieldClassName}>
              <span className="mr-2.5 text-sm text-steel" aria-hidden="true">⌕</span>
              <input
                type="text"
                name={searchName}
                defaultValue={searchDefaultValue}
                placeholder={searchPlaceholder}
                className="h-full w-full bg-transparent text-[13px] outline-none placeholder:text-steel/70"
              />
            </span>
          </label>
        ) : null}
        {filters.map((field) => (
          <label key={field.name} className="grid gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-steel">{field.label}</span>
            <span className={fieldClassName}>
              <select
                name={field.name}
                defaultValue={field.defaultValue ?? field.options[0]?.value ?? ""}
                className="h-full w-full appearance-none bg-transparent pr-2 text-[13px] outline-none"
                aria-label={field.label}
              >
                {field.options.map((option) => (
                  <option key={`${field.name}-${option.value}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </span>
          </label>
        ))}
        <button className="h-10 self-end rounded-[8px] bg-[#0066cc] px-4 text-[13px] font-medium tracking-[-0.18px] text-white transition active:scale-95 hover:bg-[#0071e3]">
          Tìm kiếm
        </button>
      </div>
    </form>
  );
}
