import { sanitizeHtml } from "@/lib/sanitize-html";

type HtmlContentProps = {
  html: string;
  className?: string;
};

export function HtmlContent({ html, className }: HtmlContentProps) {
  return <div className={["html-content", className].filter(Boolean).join(" ")} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />;
}
