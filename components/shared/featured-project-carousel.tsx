"use client";

import { useState } from "react";

import { ProjectCard } from "@/components/cards/project-card";
import type { Project } from "@/types";

const VISIBLE_COUNT = 3;

export function FeaturedProjectCarousel({ projects }: { projects: Project[] }) {
  const [startIndex, setStartIndex] = useState(0);

  const maxStartIndex = Math.max(0, projects.length - VISIBLE_COUNT);
  const canSlide = projects.length > VISIBLE_COUNT;

  return (
    <div className="relative bg-white px-6 lg:px-12">
      <button
        type="button"
        onClick={() => setStartIndex((current) => Math.max(0, current - 1))}
        disabled={startIndex === 0 || !canSlide}
        className="absolute left-0 top-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#0066cc] bg-white text-xl text-[#0066cc] transition hover:bg-[#0066cc] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#0066cc] lg:inline-flex"
        aria-label="Xem dự án trước"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={() => setStartIndex((current) => Math.min(maxStartIndex, current + 1))}
        disabled={startIndex >= maxStartIndex || !canSlide}
        className="absolute right-0 top-1/2 z-10 hidden h-12 w-12 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#0066cc] bg-white text-xl text-[#0066cc] transition hover:bg-[#0066cc] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#0066cc] lg:inline-flex"
        aria-label="Xem dự án tiếp theo"
      >
        ›
      </button>

      <div className="overflow-hidden bg-white">
        <div
          className="flex gap-6 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(calc(${startIndex} * -33.333333% - ${startIndex * 8}px))`
          }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex-none"
              style={{
                flexBasis: "calc((100% - 3rem) / 3)"
              }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
