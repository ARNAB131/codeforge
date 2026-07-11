"use client";

import {
  use,
  useCallback,
  useEffect,
  useState
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  BookOpen,
  Code2,
  GitBranch,
  Lock,
  Star,
  Trash2
} from "lucide-react";
import Header from "@/components/Header";
import LoadingScreen from "@/components/LoadingScreen";
import { createClient } from "@/lib/supabase/client";
import type {
  Profile,
  Repository
} from "@/types/database";

interface RepositoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RepositoryPage({
  params
}: RepositoryPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [repository, setRepository] =
    useState<Repository | null>(null);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [starId, setStarId] =
    useState<string | null>(null);

  const [starCount, setStarCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [starLoading, setStarLoading] =
    useState(false);
  const [error, setError] = useState("");

  const loadRepository = useCallback(async () => {
    const supabase = createClient();

    const {
      data: { user }
    } = await supabase.auth.getUser();

    setCurrentUserId(user?.id ?? null);

    const {
      data: repositoryData,
      error: repositoryError
    } = await supabase
      .from("repositories")
      .select(`
        *,
        profiles (*),
        repository_stars (id, user_id)
      `)
      .eq("id", id)
      .single();

    if (
      repositoryError ||
      !repositoryData
    ) {
      setError(
        repositoryError?.message ||
          "Repository not found."
      );
      setLoading(false);
      return;
    }

    const normalizedRepository =
      repositoryData as Repository & {
        repository_stars?: Array<{
          id: string;
          user_id: string;
        }>;
      };

    setRepository(normalizedRepository);
    setProfile(
      normalizedRepository.profiles ?? null
    );

    const stars =
      normalizedRepository.repository_stars ??
      [];

    setStarCount(stars.length);

    const currentStar = stars.find(
      (star) => star.user_id === user?.id
    );

    setStarId(currentStar?.id ?? null);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadRepository();
  }, [loadRepository]);

  async function handleStar() {
    if (!currentUserId) {
      router.push("/auth");
      return;
    }

    if (!repository || starLoading) {
      return;
    }

    setStarLoading(true);

    const supabase = createClient();

    if (starId) {
      const { error: deleteError } =
        await supabase
          .from("repository_stars")
          .delete()
          .eq("id", starId);

      if (!deleteError) {
        setStarId(null);
        setStarCount((count) =>
          Math.max(0, count - 1)
        );
      }
    } else {
      const { data, error: insertError } =
        await supabase
          .from("repository_stars")
          .insert({
            repository_id: repository.id,
            user_id: currentUserId
          })
          .select("id")
          .single();

      if (!insertError && data) {
        setStarId(data.id);
        setStarCount((count) => count + 1);
      }
    }

    setStarLoading(false);
  }

  async function handleDelete() {
    if (
      !repository ||
      currentUserId !== repository.owner_id
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${repository.name}" permanently?`
    );

    if (!confirmed) {
      return;
    }

    const supabase = createClient();

    const { error: deleteError } =
      await supabase
        .from("repositories")
        .delete()
        .eq("id", repository.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!repository) {
    return (
      <main className="auth-page">
        <section
          className="card"
          style={{
            maxWidth: 500,
            padding: 30,
            textAlign: "center"
          }}
        >
          <h1>Repository unavailable</h1>
          <p
            style={{
              color: "var(--text-secondary)"
            }}
          >
            {error}
          </p>

          <Link
            href="/dashboard"
            className="button button-primary"
          >
            Return to dashboard
          </Link>
        </section>
      </main>
    );
  }

  const isOwner =
    currentUserId === repository.owner_id;

  return (
    <>
      <Header
        username={profile?.username}
        fullName={profile?.full_name}
      />

      <section className="repository-header">
        <div className="page-container">
          <div className="repository-title-line">
            <Code2 size={20} />

            <Link href="/dashboard">
              {profile?.username || "developer"}
            </Link>

            <span>/</span>

            <strong>{repository.name}</strong>

            <span className="visibility-badge">
              {repository.visibility === "private" && (
                <Lock
                  size={10}
                  style={{ marginRight: 4 }}
                />
              )}

              {repository.visibility}
            </span>
          </div>

          {repository.description && (
            <p
              style={{
                color: "var(--text-secondary)"
              }}
            >
              {repository.description}
            </p>
          )}

          <nav className="repository-tabs">
            <span className="repository-tab repository-tab-active">
              <Code2 size={16} />
              Code
            </span>

            <span className="repository-tab">
              <BookOpen size={16} />
              README
            </span>
          </nav>
        </div>
      </section>

      <main className="repository-content">
        <div className="page-container">
          {error && (
            <div
              className="error-message"
              style={{ marginBottom: 18 }}
            >
              {error}
            </div>
          )}

          <div className="repository-toolbar">
            <button
              type="button"
              className="button button-secondary branch-selector"
            >
              <GitBranch size={16} />
              {repository.default_branch}
            </button>

            <div
              style={{
                display: "flex",
                gap: 10
              }}
            >
              <button
                type="button"
                className={`button ${
                  starId
                    ? "button-primary"
                    : "button-secondary"
                }`}
                onClick={handleStar}
                disabled={starLoading}
              >
                <Star
                  size={16}
                  fill={
                    starId
                      ? "currentColor"
                      : "none"
                  }
                />

                {starId ? "Starred" : "Star"}
                <span>{starCount}</span>
              </button>

              {isOwner && (
                <button
                  type="button"
                  className="button button-danger"
                  onClick={handleDelete}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
            </div>
          </div>

          <section className="card readme">
            <div className="readme-header">
              README.md
            </div>

            <article className="markdown">
              <ReactMarkdown>
                {repository.readme ||
                  "# Repository\n\nNo README has been added."}
              </ReactMarkdown>
            </article>
          </section>
        </div>
      </main>
    </>
  );
}
