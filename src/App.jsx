import { useState } from "react";
import {
  profile, about, stats, skills, experience, projects, education, certifications,
} from "./data.js";
import ChatWidget from "./ChatWidget.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const NAV = ["About", "Skills", "Experience", "Projects", "Contact"];

function Section({ id, title, children }) {
  return (
    <section id={id} className="section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function App() {
  const [menu, setMenu] = useState(false);

  return (
    <>
      <header className="nav">
        <a href="#top" className="logo">NE<span>.</span></a>
        <div className="nav-right">
          <nav className={menu ? "open" : ""}>
            {NAV.map((n) => (
              <a key={n} href={`#${n.toLowerCase()}`} onClick={() => setMenu(false)}>{n}</a>
            ))}
            <a href={profile.resume} className="btn small" target="_blank" rel="noreferrer">Resume</a>
          </nav>
          <ThemeToggle />
          <button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="Toggle menu">
            {menu ? "✕" : "☰"}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="hello">Hi, I'm</p>
            <h1>{profile.name}</h1>
            <p className="role">{profile.role} · React.js · Node.js · Real-Time Systems</p>
            <p className="tagline">{profile.tagline}</p>
            <div className="cta">
              <a href="#projects" className="btn">View my work</a>
              <a href={profile.resume} className="btn ghost" target="_blank" rel="noreferrer">Download resume</a>
            </div>
            <div className="socials">
              <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={`mailto:${profile.email}`}>Email</a>
            </div>
          </div>
        </section>

        <Section id="about" title="About me">
          <div className="about">
            <div>{about.map((p, i) => <p key={i}>{p}</p>)}</div>
            <div className="stats">
              {stats.map((s) => (
                <div key={s.label} className="stat">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="skills" title="Skills">
          <div className="skills">
            {skills.map((g) => (
              <div key={g.group} className="card">
                <h3>{g.group}</h3>
                <div className="chips">
                  {g.items.map((s) => <span key={s} className="chip">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="experience" title="Experience">
          {experience.map((job) => (
            <article key={job.company} className="job card">
              <div className="job-head">
                <div>
                  <h3>{job.title}</h3>
                  <p className="muted">{job.company} · {job.location}</p>
                </div>
                <span className="period">{job.period}</span>
              </div>
              <ul className="points">
                {job.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </article>
          ))}
          <div className="edu">
            <div className="card">
              <p className="kicker small">Education</p>
              <h3>{education.degree}</h3>
              <p className="muted">{education.school} · {education.year}</p>
            </div>
            {certifications.map((c) => (
              <div key={c.name} className="card">
                <p className="kicker small">Certification</p>
                <h3>{c.name}</h3>
                <p className="muted">
                  {c.issuer} · <a href={c.url} target="_blank" rel="noreferrer">Verify ↗</a>
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="projects" title="Projects">
          <div className="projects">
            {projects.map((p) => (
              <article key={p.name} className={`card project ${p.featured ? "featured" : ""}`}>
                <div className="project-head">
                  <div>
                    <h3>{p.name}</h3>
                    <p className="muted">{p.kind}</p>
                  </div>
                  <span className="role-pill">{p.role}</span>
                </div>
                <p>{p.summary}</p>
                <ul className="points">
                  {p.points.map((pt) => <li key={pt}>{pt}</li>)}
                </ul>
                <div className="chips">
                  {p.tech.map((t) => <span key={t} className="chip mono">{t}</span>)}
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="contact" title="Let's work together">
          <div className="contact card">
            <p>
              I'm open to Full Stack and Frontend roles, especially teams building real-time or
              data-heavy products. The best way to reach me is email.
            </p>
            <a href={`mailto:${profile.email}`} className="btn">{profile.email}</a>
            <div className="socials">
              <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
              <span className="muted">{profile.location}</span>
            </div>
          </div>
        </Section>
      </main>

      <ChatWidget />
      <footer>© {new Date().getFullYear()} {profile.name}. Built with React + Vite.</footer>
    </>
  );
}
