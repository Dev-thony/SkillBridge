import { ArrowRight, ArrowUpRight, Check, Code2, GitBranch, Layers3, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { SkillTag } from "../components/ui/SkillTag";
import "./LandingPage.css";

const steps = [
  {
    number: "01",
    title: "Discover a project",
    description:
      "Explore ideas from other builders and find a project that fits your interests and skills.",
    icon: Layers3,
  },
  {
    number: "02",
    title: "Bring your skills",
    description:
      "See what a team needs, introduce yourself, and request to contribute where you can help.",
    icon: Users,
  },
  {
    number: "03",
    title: "Build together",
    description:
      "Work with a team, learn through collaboration, and make progress on a real project.",
    icon: GitBranch,
  },
];

function WorkbenchPreview() {
  return (
    <div className="workbench" aria-label="Illustration of a collaborative project workspace">
      <div className="workbench__topbar">
        <div className="workbench__window-dots" aria-hidden="true"><i /><i /><i /></div>
        <span className="workbench__topbar-label">Project workspace</span>
        <span className="workbench__live"><span /> In progress</span>
      </div>

      <div className="workbench__body">
        <aside className="workbench__rail" aria-hidden="true">
          <span className="workbench__rail-mark"><Code2 size={17} /></span>
          <span className="workbench__rail-item workbench__rail-item--active"><Layers3 size={16} /></span>
          <span className="workbench__rail-item"><GitBranch size={16} /></span>
          <span className="workbench__rail-item"><Users size={16} /></span>
        </aside>

        <div className="workbench__content">
          <div className="workbench__project-heading">
            <div>
              <span className="workbench__eyebrow">FEATURED PROJECT</span>
              <h2>Open-source study planner</h2>
              <p>A focused space to plan study sessions and share progress.</p>
            </div>
            <span className="workbench__project-icon"><Layers3 size={21} /></span>
          </div>

          <div className="workbench__divider" />
          <div className="workbench__section-title">
            <span>Team skills</span>
            <span className="workbench__count">3 areas</span>
          </div>
          <div className="workbench__skills">
            <SkillTag tone="brand">React</SkillTag>
            <SkillTag>UI/UX design</SkillTag>
            <SkillTag>Node.js</SkillTag>
          </div>

          <div className="workbench__task-list">
            <div className="workbench__task workbench__task--done">
              <span className="workbench__task-check"><Check size={12} /></span>
              <span>Define the first release scope</span>
              <span className="workbench__task-status">Done</span>
            </div>
            <div className="workbench__task">
              <span className="workbench__task-check" />
              <span>Build the weekly planner view</span>
              <span className="workbench__task-status">In progress</span>
            </div>
            <div className="workbench__task">
              <span className="workbench__task-check" />
              <span>Connect the project API</span>
              <span className="workbench__task-status">Next</span>
            </div>
          </div>

          <div className="workbench__bottom">
            <div className="workbench__team">
              <span className="workbench__avatar workbench__avatar--one">A</span>
              <span className="workbench__avatar workbench__avatar--two">M</span>
              <span className="workbench__avatar workbench__avatar--three">J</span>
              <span className="workbench__team-label">A team of builders</span>
            </div>
            <span className="workbench__collaborating"><span /> Collaborating</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="container landing-hero__grid">
          <div className="landing-hero__copy">
            <p className="landing-eyebrow">
              <span /> A collaboration hub for builders
            </p>
            <h1>
              Build projects together. <span>Gain real-world experience.</span>
            </h1>
            <p className="landing-hero__description">
              Find collaborators, contribute your skills, and turn ideas into
              projects you can share with the world.
            </p>
            <div className="landing-hero__actions">
              <Link to="/explore" className="landing-hero__primary-btn">
                Explore Projects
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link className="landing-hero__secondary" to="/register">
                Create your profile{" "}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <p className="landing-hero__note">
              Start with your skills. Find your people. Build something
              meaningful.
            </p>
          </div>
          <div className="landing-hero__visual">
            <WorkbenchPreview />
            <div className="landing-visual-caption">
              <span className="landing-visual-caption__mark">
                <GitBranch size={15} />
              </span>
              <span>
                <strong>From idea to working project</strong>
                <small>Plan, contribute, and make progress as a team.</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-heading">
            <p className="section-heading__eyebrow">HOW IT WORKS</p>
            <h2>A clearer path from learning to building.</h2>
            <p>
              SkillBridge helps you find a team and put your skills to use
              through collaboration.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map(({ number, title, description, icon: Icon }) => (
              <article className="step-card" key={number}>
                <div className="step-card__top">
                  <span className="step-card__number">{number}</span>
                  <span className="step-card__icon">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="container landing-cta__inner">
          <div>
            <p className="section-heading__eyebrow">
              YOUR NEXT PROJECT STARTS HERE
            </p>
            <h2>Good work gets better together.</h2>
            <p>
              Find a project to join, or bring your own idea and build a team
              around it.
            </p>
          </div>
          <div className="landing-cta__actions">
            <Link className="landing-cta__button" to="/explore">
              Explore projects <ArrowRight size={17} />
            </Link>
            <Link className="landing-cta__text-link" to="/register">
              Create a profile
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container landing-footer__inner">
          <Link to="/" className="navbar__brand" aria-label="SkillBridge home">
            <img
              src="/images/skillbridge-logo.png"
              alt="SkillBridge"
              className="navbar__logo"
            />
            <span className="navbar__brand-name">SkillBridge</span>
          </Link>
          <p>Built for people who want to learn by building together.</p>
          <div className="landing-footer__links">
            <Link to="/explore">Explore Projects</Link>
            <Link to="/#how-it-works">How It Works</Link>
            <Link to="/login">Log in</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
