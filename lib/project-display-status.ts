export const PROJECT_DISPLAY_STATUS_OPTIONS = [
  { value: "NONE", label: "Không" },
  { value: "ON_SALE", label: "Đang mở bán" },
  { value: "COMING_SOON", label: "Sắp mở bán" },
  { value: "HANDED_OVER", label: "Đã bàn giao" }
] as const;

export type ProjectDisplayStatus = (typeof PROJECT_DISPLAY_STATUS_OPTIONS)[number]["value"];

export function getProjectDisplayStatusLabel(status?: ProjectDisplayStatus | null) {
  return PROJECT_DISPLAY_STATUS_OPTIONS.find((item) => item.value === status)?.label;
}

export function getProjectDisplayStatusClassName(status?: ProjectDisplayStatus | null) {
  switch (status) {
    case "ON_SALE":
      return "bg-[#e4fbef] text-[#159957]";
    case "COMING_SOON":
      return "bg-[#fff4d8] text-[#b7791f]";
    case "HANDED_OVER":
      return "bg-[#e8f0ff] text-[#285ec9]";
    default:
      return "";
  }
}
