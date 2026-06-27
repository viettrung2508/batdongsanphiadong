type FieldLabelProps = {
  label: string;
  required?: boolean;
  className?: string;
};

export function FieldLabel({ label, required = false, className = "text-sm font-medium text-ink" }: FieldLabelProps) {
  return (
    <span className={className}>
      {label}
      {required ? <span className="ml-1 text-red-600">*</span> : null}
    </span>
  );
}
