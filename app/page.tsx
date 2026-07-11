import Link from "next/link";
import {
  ArrowRight,
  Code2,
  GitBranch,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <>
      <header className="header">
        <div className="page-container header-content">
          <Link href="/" className="brand">
            <span className="brand-icon">
              <Code2 size={21} />
            </span>

            <span>CodeForge</span>
          </Link>

          <div className="header-actions">
            {user ? (
              <Link
                href="/dashboard"
                className="button button-primary"
              >
                Dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="button button-secondary"
                >
                  Sign in
                </Link>

                <Link
                  href="/auth?mode=signup"
                  className="button button-primary"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="hero">
        <div className="page-container hero-grid">
          <section>
            <span className="hero-label">
              <Sparkles size={14} />
              Build, collaborate and ship
            </span>

            <h1>
              Your code deserves a{" "}
              <span className="gradient-text">
                powerful home.
              </span>
            </h1>

            <p className="hero-description">
              CodeForge is a modern repository platform
              where developers can create projects,
              publish documentation and collaborate on
              ideas from one elegant workspace.
            </p>

            <div className="hero-actions">
              <Link
                href={user ? "/dashboard" : "/auth?mode=signup"}
                className="button button-primary"
              >
                Start building
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/auth"
                className="button button-secondary"
              >
                <GitBranch size={17} />
                Explore platform
              </Link>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 20,
                marginTop: 36,
                color: "var(--text-secondary)",
                fontSize: 14
              }}
            >
              <span className="meta-item">
                <ShieldCheck size={16} />
                Supabase authentication
              </span>

              <span className="meta-item">
                <Code2 size={16} />
                Markdown README support
              </span>
            </div>
          </section>

          <section className="hero-preview">
            <div className="preview-window">
              <div className="preview-toolbar">
                <span className="preview-dot" />
                <span className="preview-dot" />
                <span className="preview-dot" />
              </div>

              <div className="preview-body">
                <div
                  style={{
                    color: "var(--accent-hover)",
                    fontWeight: 700,
                    marginBottom: 22
                  }}
                >
                  arnab / doctigo-platform
                </div>

                <div
                  className="code-line"
                  style={{ width: "92%" }}
                />
                <div
                  className="code-line"
                  style={{ width: "74%" }}
                />
                <div
                  className="code-line"
                  style={{ width: "86%" }}
                />
                <div
                  className="code-line"
                  style={{ width: "58%" }}
                />

                <div
                  style={{
                    marginTop: 30,
                    padding: 18,
                    border: "1px solid var(--border)",
                    borderRadius: 8
                  }}
                >
                  <strong># Doctigo Platform</strong>

                  <p
                    style={{
                      color: "var(--text-secondary)",
                      lineHeight: 1.6
                    }}
                  >
                    Intelligent healthcare repository
                    powered by modern web technologies.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
