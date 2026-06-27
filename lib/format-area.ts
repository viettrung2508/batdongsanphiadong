const AREA_UNIT_PATTERN = /(m2|m²|ha|km2|km²|ft2|ft²|sqm|sq\.?\s?m|\/)/i;

export function formatAreaValue(value?: string | null) {
  if (!value) {
    return value ?? "";
  }

  const trimmedValue = value.trim();

  if (!trimmedValue || trimmedValue === "Đang cập nhật" || AREA_UNIT_PATTERN.test(trimmedValue)) {
    return trimmedValue;
  }

  return `${trimmedValue} m2`;
}
