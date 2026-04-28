import React, { useEffect, useRef, useState } from 'react';
import { getProjects } from '../services/projectService';
import { Project } from '../types';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

// ─── Project Detail Modal ────────────────────────────────────────────────────
const ProjectModal: React.FC<{ project: Project; index: number; onClose: () => void }> = ({ project, index, onClose }) => {
  const hasLive = project.link && project.link !== 'na' && !project.disabled;
  const hasGithub = !!project.githubLink;
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative bg-[#FFF9E6] border-[6px] border-black shadow-[12px_12px_0px_#000] w-full max-w-7xl min-h-[60vh] max-h-[85vh] overflow-y-auto flex flex-col md:flex-row">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black text-white w-10 h-10 flex items-center justify-center font-black text-xl border-[3px] border-black hover:bg-[#FFD600] hover:text-black transition-colors shadow-[3px_3px_0px_#FFD600] hover:shadow-none"
        >
          ✕
        </button>

        {/* Left — Image */}
        <div className="md:w-[45%] flex-shrink-0 border-b-[6px] md:border-b-0 md:border-r-[6px] border-black relative">
          <div
            className="absolute top-0 left-0 z-10 px-4 py-1.5 font-black uppercase text-[10px] tracking-widest border-r-[4px] border-b-[4px] border-black"
            style={{ backgroundColor: project.color }}
          >
            #{String(index + 1).padStart(2, '0')}
          </div>

          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-80 md:h-full object-cover"
              style={{ minHeight: '420px' }}
            />
          ) : (
            <div
              className="w-full h-80 md:h-full flex items-center justify-center text-9xl font-black opacity-20"
              style={{ backgroundColor: project.color + '33', minHeight: '420px' }}
            >
              ?
            </div>
          )}

          {project.disabled && (
            <div className="absolute bottom-4 left-4">
              <span className="bg-[#FFD600] text-black px-3 py-1 font-black uppercase text-[10px] border-2 border-black shadow-[2px_2px_0px_#000]">
                Enterprise Only ⭐
              </span>
            </div>
          )}
        </div>

        {/* Right — Details */}
        <div className="flex-1 p-8 md:p-12 flex flex-col gap-6">
          {/* Title */}
          <div>
            <div className="inline-block bg-black text-[#FFD600] px-3 py-0.5 font-black uppercase text-[10px] tracking-widest mb-3 border-2 border-black">
              Project Overview
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-black">
              {project.title}
            </h2>
          </div>

          {/* Description */}
          <div className="bg-white border-[3px] border-dashed border-black/30 p-5 relative">
            <div
              className="absolute -top-3 -left-1 px-2 py-0.5 font-black uppercase text-[9px] tracking-widest border-2 border-black text-black"
              style={{ backgroundColor: project.color }}
            >
              About
            </div>
            <p className="font-bold text-gray-800 leading-relaxed text-base md:text-xl mt-1">
              {project.description}
            </p>
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div>
              <p className="font-black uppercase text-[10px] tracking-widest text-gray-500 mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-sm font-black uppercase tracking-tight border-[2px] border-black shadow-[2px_2px_0px_#000]"
                    style={{ backgroundColor: project.color + '33', color: '#000' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-4 mt-auto pt-2">
            {hasLive ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-black text-white border-[3px] border-black py-3 font-black uppercase text-sm tracking-wide shadow-[5px_5px_0px_#FFD600] hover:bg-[#FFD600] hover:text-black hover:shadow-[2px_2px_0px_#000] transition-all active:translate-y-0.5"
              >
                <ExternalLinkIcon />
                Live Demo →
              </a>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-1 bg-gray-200 text-gray-500 border-[3px] border-black py-3 font-black uppercase text-sm tracking-wide cursor-not-allowed">
                <span className="flex items-center gap-2"><ExternalLinkIcon /> {project.disabled ? 'Private / Enterprise' : 'No Live Link'}</span>
                {project.disabled && <span className="text-[9px] font-semibold opacity-70">Contact me for a walkthrough</span>}
              </div>
            )}
            {hasGithub && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-black border-[3px] border-black px-5 py-3 font-black uppercase text-sm tracking-wide shadow-[5px_5px_0px_#000] hover:bg-black hover:text-white hover:shadow-[2px_2px_0px_#000] transition-all active:translate-y-0.5"
              >
                <GithubIcon />
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectCard: React.FC<{ project: Project; index: number; onClick: () => void }> = ({ project, index, onClick }) => {
  const hasLive = project.link && project.link !== 'na' && !project.disabled;
  const hasGithub = !!project.githubLink;

  return (
    <div
      onClick={onClick}
      className="group bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden border-b-[4px] border-black bg-gray-100">
        <div
          className="absolute top-0 left-0 z-10 px-3 py-1 font-black uppercase text-[10px] tracking-widest border-r-[3px] border-b-[3px] border-black"
          style={{ backgroundColor: project.color }}
        >
          #{String(index + 1).padStart(2, '0')}
        </div>

        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-6xl font-black opacity-20"
            style={{ backgroundColor: project.color + '22' }}
          >
            ?
          </div>
        )}

        {project.disabled && (
          <div className="absolute bottom-2 right-2">
            <span className="bg-[#FFD600] text-black px-2 py-1 font-black uppercase text-[10px] border-2 border-black shadow-[2px_2px_0px_#000]">
              Enterprise Only ⭐
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        <h3 className="text-2xl font-black uppercase tracking-tighter leading-none text-black">
          {project.title}
        </h3>

        <p className="text-sm font-semibold text-gray-700 leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-tight border border-black"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto pt-2" onClick={(e) => e.stopPropagation()}>
          {hasLive ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white border-[3px] border-black py-2.5 font-black uppercase text-xs tracking-wide shadow-[4px_4px_0px_#FFD600] hover:bg-[#FFD600] hover:text-black hover:shadow-[2px_2px_0px_#000] transition-all active:translate-y-0.5"
            >
              <ExternalLinkIcon />
              Live Demo
            </a>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-500 border-[3px] border-black py-2.5 font-black uppercase text-xs tracking-wide cursor-not-allowed">
              <ExternalLinkIcon />
              {project.disabled ? 'Private' : 'No Link'}
            </div>
          )}

          {hasGithub && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white text-black border-[3px] border-black px-4 py-2.5 font-black uppercase text-xs tracking-wide shadow-[4px_4px_0px_#000] hover:bg-black hover:text-white hover:shadow-[2px_2px_0px_#000] transition-all active:translate-y-0.5"
              title="View on GitHub"
            >
              <GithubIcon />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          )}
        </div>

        {/* Click hint */}
        <div className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Click to expand ↗
        </div>
      </div>
    </div>
  );
};

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<{ project: Project; index: number } | null>(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('portfolio_hero_dark') !== 'false');

  useEffect(() => {
    const handler = () => setIsDark(localStorage.getItem('portfolio_hero_dark') !== 'false');
    window.addEventListener('portfolioThemeChange', handler);
    return () => window.removeEventListener('portfolioThemeChange', handler);
  }, []);

  useEffect(() => {
    getProjects().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="min-h-screen bg-[#FFF9E6] pb-24">
      {/* Grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025] z-0"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Admin-style dark header */}
      <div className={`${isDark ? 'bg-black border-b-4 border-[#FFD600]' : 'bg-[#FFF9E6] border-b-4 border-black'} pt-36 pb-12 px-6 relative overflow-hidden`}>
        <div className={`absolute -right-10 -top-8 text-[20vw] font-black ${isDark ? 'text-white/[0.03]' : 'text-black/[0.03]'} select-none pointer-events-none uppercase leading-none italic`}>WORKS</div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <p className={`${isDark ? 'text-[#FFD600]/70' : 'text-black/50'} font-black text-[10px] uppercase tracking-[0.3em] mb-2`}>Portfolio</p>
            <h1 className={`text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none ${isDark ? 'text-white' : 'text-black'}`}>
              My{' '}
              <span
                className="relative inline-block"
                style={{
                  WebkitTextStroke: '3px #FFD600',
                  color: 'transparent',
                  textShadow: '8px 8px 0px #FF4B4B',
                }}
              >
                Works
              </span>
            </h1>
            {!loading && (
              <div className="flex items-center gap-3 mt-3">
                <div className="h-[4px] w-16 bg-[#FFD600] border border-black" />
                <p className={`font-bold ${isDark ? 'text-white/50' : 'text-black/50'} text-sm`}>
                  {projects.length} project{projects.length !== 1 ? 's' : ''} built
                </p>
              </div>
            )}
          </div>


        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12">

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] h-96 animate-pulse" />
            ))}
          </div>
        )}

        {/* Projects grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={() => setSelectedProject({ project, index })}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="text-8xl">🚧</div>
            <div className="text-center">
              <h2 className="text-4xl font-black uppercase tracking-tighter">No Projects Yet</h2>
              <p className="font-bold text-gray-500 mt-2">Check back soon — things are being built!</p>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject.project}
          index={selectedProject.index}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

export default ProjectsPage;
