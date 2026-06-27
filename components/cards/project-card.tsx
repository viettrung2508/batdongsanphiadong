import Image from "next/image";
import Link from "next/link";

import { HtmlContent } from "@/components/shared/html-content";
import { getProjectDisplayStatusClassName, getProjectDisplayStatusLabel } from "@/lib/project-display-status";
import { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/du-an/${project.slug}`} className="block h-full">
      <article className="content-lift group flex h-full flex-col overflow-hidden rounded-[12px] border border-[#d9dce3] bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
        <div className="relative h-56 overflow-hidden border-b border-[#e8ebf0]">
          <Image src={project.thumbnail} alt={project.name} fill className="object-cover transition duration-700 group-hover:scale-[1.03]" />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {project.projectStatusTag ? (
                <span className={`mb-2 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${getProjectDisplayStatusClassName(project.projectStatusTag)}`}>
                  {getProjectDisplayStatusLabel(project.projectStatusTag)}
                </span>
              ) : null}
              <h3 className="line-clamp-2 min-h-[3.5rem] text-[20px] font-medium leading-[1.35] tracking-[-0.2px] text-[#222]">
                {project.name}
              </h3>
              <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-[15px] font-medium leading-[1.4] text-[#0066cc]">
                {project.cardMeta || project.address}
              </p>
            </div>
            <div className="shrink-0 rounded-[10px] bg-[linear-gradient(135deg,#fff5e1,#ffebbb)] px-3 py-2 text-right shadow-[0_10px_20px_rgba(191,138,38,0.12)] ring-1 ring-[#ecd39c]">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9f6a13]">Giá bán</p>
              <p className="mt-1 text-lg font-black leading-none text-[#8b5a16]">{project.price}</p>
            </div>
          </div>
          <div className="mt-3 min-h-[4.75rem] overflow-hidden">
            <HtmlContent
              html={project.description}
              className="prose prose-sm max-w-none overflow-hidden text-[#545454] prose-p:my-0 prose-p:leading-7 prose-li:leading-7 prose-strong:text-[#222] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
            />
          </div>
          <div className="mt-auto border-t border-[#eceff3] pt-3">
            <span className="text-sm font-semibold text-[#2f3f5a]">{project.area}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
