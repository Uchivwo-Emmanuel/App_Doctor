import { useState, type ReactNode } from "react";
import { ArrowRight, BarChart3, Check, Gauge, Layers3, LockKeyhole, Menu, MousePointer2, Play, ShieldCheck, SlidersHorizontal, Users, X } from "lucide-react";

import fashionEditorialSite from "./assets/landing/fashion-editorial-site.png";
import fintechProductSite from "./assets/landing/fintech-product-site.png";
import hospitalityRetreatSite from "./assets/landing/hospitality-retreat-site.png";

type LandingProps = { onDemo: () => void };
const navLinks = [["Product", "#product"], ["Use cases", "#what"], ["Pricing", "#final-cta"], ["Resources", "#how"], ["About", "#security"]] as const;
const benefits = [
  { icon: <BarChart3 />, title: "Find issues early", copy: "Catch what matters before launch." },
  { icon: <Users />, title: "Real world testing", copy: "Insights from real users, not just automated checks." },
  { icon: <Layers3 />, title: "Clear next steps", copy: "Prioritized, practical recommendations." },
  { icon: <ShieldCheck />, title: "Build with confidence", copy: "Ship experiences people can trust." },
];
const steps = [
  { title: "Tell us about your app", copy: "Share a URL and a few details about your goals, audience, and what you want to learn." },
  { title: "We run real tests", copy: "We combine expert review, automated checks, and real user testing tailored to your app." },
  { title: "Get a clear report", copy: "Receive a concise report with evidence, prioritized findings, and practical next steps." },
];
const testAreas = [
  { icon: <MousePointer2 />, title: "Usability & Clarity", copy: "Can people understand what to do? We test navigation, copy, and key journeys with real users." },
  { icon: <Gauge />, title: "Performance & Reliability", copy: "We check load times, stability, error states, and mobile experience across real devices." },
  { icon: <ShieldCheck />, title: "Trust & Readiness", copy: "We assess credibility, data practices, accessibility, and launch readiness so you can ship with confidence." },
];
const securityItems = [
  { icon: <LockKeyhole />, title: "Secure testing environments", copy: "Isolated and encrypted infrastructure." },
  { icon: <SlidersHorizontal />, title: "Your data stays private", copy: "Not used for training or shared with third parties." },
  { icon: <ShieldCheck />, title: "You stay in control", copy: "You decide what to test and what to share." },
];

export function Landing({ onDemo }: LandingProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="marketing" id="top">
      <header className="marketing-header">
        <Logo />
        <nav className={menuOpen ? "marketing-nav open" : "marketing-nav"} aria-label="Landing page navigation">
          {navLinks.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <div className="marketing-header-actions"><button className="marketing-signin" onClick={onDemo}>Sign in</button><PrimaryButton onClick={onDemo}>Start a health scan</PrimaryButton></div>
        <button className="marketing-menu" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="landing-hero" id="product">
        <div className="landing-hero-copy">
          <Eyebrow>EVIDENCE-LED TESTING<br />FOR AI-BUILT WEB APPS</Eyebrow>
          <h1>Know what<br />works <span>before</span><br /><span>you ship.</span></h1>
          <p className="hero-summary">App Doctor tests your AI-built web app for usability, clarity, performance, and trust — so you can launch with confidence.</p>
          <div className="landing-actions"><PrimaryButton onClick={onDemo}>Start a health scan</PrimaryButton><a className="example-link" href="#what">See an example report <span><Play size={12} fill="currentColor" /></span></a></div>
          <div className="hero-proof" aria-label="Product benefits">{["Actionable insights", "Real user feedback", "Built for AI workflows"].map((item) => <span key={item}><i><Check /></i>{item}</span>)}</div>
        </div>
        <ProductPreview />
      </section>

      <section className="benefits-strip" aria-label="App Doctor benefits"><div className="marketing-container benefits-grid">{benefits.map((benefit) => <Feature key={benefit.title} {...benefit} />)}</div></section>

      <section id="how" className="marketing-section how-section">
        <SectionHeading eyebrow="HOW IT WORKS" title="From URL to insights in three steps." subtitle="A focused testing process designed for AI-built web apps." />
        <div className="workflow">{steps.map((step, index) => <article key={step.title}><div className="step-track"><b>{index + 1}</b><span /></div><h3>{step.title}</h3><p>{step.copy}</p></article>)}</div>
      </section>

      <section id="what" className="marketing-section test-section">
        <SectionHeading eyebrow="WHAT WE TEST" title="A complete view of your app’s health." subtitle="We look at the details that shape real user experiences." />
        <div className="test-grid">{testAreas.map((area) => <TestCard key={area.title} {...area} />)}</div>
      </section>

      <div className="mountain-region">
        <section id="security" className="marketing-section security-section">
          <div className="security-copy"><Eyebrow>SECURITY &amp; PRIVACY</Eyebrow><h2>Your app and data are in safe hands.</h2><p>We follow industry best practices for data security and privacy. Your code, content, and user data are treated with care and are never used to train AI models.</p></div>
          <div className="security-grid">{securityItems.map((item) => <SecurityItem key={item.title} {...item} />)}</div>
        </section>
        <section className="final-cta" id="final-cta"><div><h2>Launch with clarity.</h2><p>Get a clear, evidence-led view of your app before you ship.</p></div><div className="cta-action"><PrimaryButton onClick={onDemo}>Start a health scan</PrimaryButton><small>No credit card required.</small></div></section>
        <footer className="marketing-footer"><Logo tagline /><nav aria-label="Footer product navigation">{navLinks.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav><nav aria-label="Footer legal navigation"><a href="#security">Privacy</a><a href="#security">Terms</a><a href="mailto:hello@appdoctor.local">Contact</a></nav></footer>
      </div>
    </main>
  );
}

function Logo({ tagline = false }: { tagline?: boolean }) { return <a className="marketing-brand" href="#top" aria-label="App Doctor home"><span className="logo-mark" aria-hidden="true"><i /><i /><i /><i /></span><span><strong>App Doctor</strong>{tagline && <small>Better apps. Happier users.</small>}</span></a>; }
function PrimaryButton({ children, onClick }: { children: ReactNode; onClick: () => void }) { return <button className="marketing-primary" onClick={onClick}>{children}<ArrowRight /></button>; }
function Eyebrow({ children }: { children: ReactNode }) { return <p className="landing-kicker">{children}</p>; }
function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) { return <div className="section-heading"><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2><p>{subtitle}</p></div>; }
function Feature({ icon, title, copy }: { icon: ReactNode; title: string; copy: string }) { return <article className="benefit"><span className="feature-icon">{icon}</span><div><h3>{title}</h3><p>{copy}</p></div></article>; }
function TestCard({ icon, title, copy }: { icon: ReactNode; title: string; copy: string }) { return <article className="test-card"><span className="test-icon">{icon}</span><div><h3>{title}</h3><p>{copy}</p></div></article>; }
function SecurityItem({ icon, title, copy }: { icon: ReactNode; title: string; copy: string }) { return <article className="security-item"><span>{icon}</span><h3>{title}</h3><p>{copy}</p></article>; }
function ProductPreview() {
  const sites = [{ src: fashionEditorialSite, alt: "Sonder Atelier fashion editorial website preview" }, { src: fintechProductSite, alt: "Northstar Finance fintech website preview" }, { src: hospitalityRetreatSite, alt: "Marea House coastal retreat website preview" }];
  return <div className="site-card-stack" aria-label="Examples of websites App Doctor can help test"><span className="hero-orbit orbit-one" aria-hidden="true" /><span className="hero-orbit orbit-two" aria-hidden="true" /><div className="site-card-stage">{sites.map((site, index) => <figure className={`site-card site-card-${index + 1}`} key={site.alt}><img src={site.src} alt={site.alt} /></figure>)}</div></div>;
}
