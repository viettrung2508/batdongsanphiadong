"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { getProjectDisplayStatusClassName, getProjectDisplayStatusLabel } from "@/lib/project-display-status";
import type { Project } from "@/types";

export function FeaturedProjectHeroCarousel({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!projects.length) {
    return null;
  }

  const activeProject = projects[activeIndex];

  useEffect(() => {
    if (projects.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current === projects.length - 1 ? 0 : current + 1));
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [projects.length]);

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? projects.length - 1 : current - 1));
  }

  function goToNext() {
    setActiveIndex((current) => (current === projects.length - 1 ? 0 : current + 1));
  }

  return (
    <div className="relative overflow-hidden bg-[#101a2a]">
      <div
        className="absolute inset-0 flex transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {projects.map((project) => (
          <div key={project.id} className="relative h-full min-w-full">
            <Image
              src={project.thumbnail}
              alt={project.name}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,37,0.04)_0%,rgba(8,18,37,0.08)_55%,rgba(8,18,37,0.28)_100%)] transition-opacity duration-700" />

      <div className="relative z-10 flex min-h-[420px] flex-col justify-end p-6 text-white sm:min-h-[500px] sm:p-8 lg:p-10">
        <div
          key={activeProject.id}
          className="max-w-3xl rounded-[16px] bg-[linear-gradient(135deg,rgba(8,18,37,0.62),rgba(8,18,37,0.34))] px-5 py-4 shadow-[0_18px_50px_rgba(8,18,37,0.16)] backdrop-blur-[6px] animate-[fade-slide-in_700ms_ease-out] sm:px-6 sm:py-5"
        >
          {activeProject.projectStatusTag ? (
            <span className={`mb-4 inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${getProjectDisplayStatusClassName(activeProject.projectStatusTag)}`}>
              {getProjectDisplayStatusLabel(activeProject.projectStatusTag)}
            </span>
          ) : null}
          <h2 className="font-display text-[2.25rem] leading-[1.02] text-white [text-shadow:0_2px_12px_rgba(8,18,37,0.38)] sm:text-[3.25rem]">
            {activeProject.name}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/90 [text-shadow:0_2px_10px_rgba(8,18,37,0.34)]">
            {activeProject.address}
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/78 [text-shadow:0_2px_10px_rgba(8,18,37,0.3)]">
            Quy mô: {activeProject.scale}
          </p>
        </div>
      </div>

      {projects.length > 1 ? (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-5 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-2xl text-[#16233a] transition hover:bg-white"
            aria-label="Dự án trước"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-5 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-2xl text-[#16233a] transition hover:bg-white"
            aria-label="Dự án tiếp theo"
          >
            ›
          </button>

          <div className="absolute bottom-5 right-6 z-20 flex items-center gap-2.5 sm:bottom-6 sm:right-8">
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={index === activeIndex ? "h-2.5 w-6 rounded-full bg-white" : "h-2.5 w-2.5 rounded-full bg-white/55"}
                aria-label={`Chuyển tới dự án ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
