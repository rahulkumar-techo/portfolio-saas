/**
 * MinimalTheme
 * Clean Apple-style portfolio theme
 * Mobile-first, token-driven, dark/light aware
 */

import React from "react";

interface MinimalThemeProps {
  data: any;
  design: any;
}

export default function MinimalTheme({
  data,
  design,
}: MinimalThemeProps) {
  const {
    hero,
    skills = [],
    projects = [],
    experience = [],
    education = [],
    links = [],
  } = data || {};

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={
        {
          "--primary": design?.primaryColor || "#6366f1",
          "--background": design?.darkMode ? "#000000" : "#ffffff",
          "--text": design?.darkMode ? "#ffffff" : "#111111",
        } as React.CSSProperties
      }
    >
      <div
        className="px-6 md:px-12 py-16 max-w-6xl mx-auto"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--text)",
          fontFamily: design?.fontFamily || "Inter, sans-serif",
        }}
      >
        {/* HERO */}
        <section className="text-center mb-24">
          {hero?.profileImage && (
            <img
              src={hero.profileImage}
              alt={hero.name}
              className="w-28 h-28 rounded-full mx-auto mb-6 object-cover"
            />
          )}

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {hero?.name}
          </h1>

          {hero?.title && (
            <p
              className="text-lg mt-4"
              style={{ color: "var(--primary)" }}
            >
              {hero.title}
            </p>
          )}

          {hero?.summary && (
            <p className="mt-6 max-w-2xl mx-auto text-gray-500 leading-relaxed dark:text-gray-400">
              {hero.summary}
            </p>
          )}
        </section>

        {/* SKILLS */}
        {skills.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-semibold mb-8">
              Skills
            </h2>

            <div className="flex flex-wrap gap-3">
              {skills.map((skill: any, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full text-sm border"
                  style={{
                    borderColor: "var(--primary)",
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-semibold mb-10">
              Projects
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project: any, index: number) => (
                <div
                  key={index}
                  className="p-6 border rounded-xl transition hover:shadow-md"
                >
                  <h3 className="text-lg font-semibold">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-gray-500 text-sm">
                    {project.description}
                  </p>

                  {project.techStack && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.techStack.map(
                        (tech: string, i: number) => (
                          <span
                            key={i}
                            className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        )
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex gap-4 text-sm">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        className="hover:underline"
                        style={{ color: "var(--primary)" }}
                      >
                        Live
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        className="text-gray-500 hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EXPERIENCE */}
        {experience.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-semibold mb-8">
              Experience
            </h2>

            <div className="space-y-8">
              {experience.map((exp: any, index: number) => (
                <div key={index}>
                  <h3 className="font-semibold">
                    {exp.role} — {exp.company}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {exp.location}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-semibold mb-8">
              Education
            </h2>

            <div className="space-y-6">
              {education.map((edu: any, index: number) => (
                <div key={index}>
                  <h3 className="font-semibold">
                    {edu.degree} — {edu.institution}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {edu.field}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LINKS */}
        {links.length > 0 && (
          <section className="text-center mt-16">
            <div className="flex justify-center gap-6 text-sm">
              {links.map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  className="hover:underline"
                  style={{ color: "var(--primary)" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}