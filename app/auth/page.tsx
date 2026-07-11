"use client";

import {
  FormEvent,
  Suspense,
  useState
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Code2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function AuthenticationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialMode =
    searchParams.get("mode") === "signup"
      ? "signup"
      : "signin";

  const [mode, setMode] = useState<
    "signin" | "signup"
  >(initialMode);

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();

    try {
      if (mode === "signup") {
        const {
          data,
          error: signUpError
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              username,
              full_name: fullName
            }
          }
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data.session) {
          router.push("/dashboard");
          router.refresh();
          return;
        }

        setMessage(
          "Account created. Check your email to verify your account."
        );
      } else {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password
          });

        if (signInError) {
          throw signInError;
        }

        router.push("/dashboard");
        router.refresh();
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-wrapper">
        <Link
          href="/"
          className="brand auth-brand"
        >
          <span className="brand-icon">
            <Code2 size={21} />
          </span>

          CodeForge
        </Link>

        <section className="card auth-card">
          <h1>
            {mode === "signin"
              ? "Welcome back"
              : "Create your account"}
          </h1>

          <p className="auth-subtitle">
            {mode === "signin"
              ? "Sign in to access your repositories."
              : "Start building and sharing your projects."}
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            {mode === "signup" && (
              <>
                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor="fullName"
                  >
                    Full name
                  </label>

                  <input
                    id="fullName"
                    className="input"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    placeholder="Arnab Deb"
                    required
                  />
                </div>

                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor="username"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    className="input"
                    value={username}
                    onChange={(event) =>
                      setUsername(
                        event.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9_-]/g, "")
                      )
                    }
                    placeholder="arnab131"
                    minLength={3}
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label
                className="form-label"
                htmlFor="email"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label
                className="form-label"
                htmlFor="password"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Minimum 8 characters"
                minLength={8}
                required
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="button button-primary"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "signin"
              ? "New to CodeForge?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(
                  mode === "signin"
                    ? "signup"
                    : "signin"
                );
                setError("");
                setMessage("");
              }}
            >
              {mode === "signin"
                ? "Create an account"
                : "Sign in"}
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}

export default function AuthenticationPage() {
  return (
    <Suspense fallback={<div />}>
      <AuthenticationForm />
    </Suspense>
  );
}
