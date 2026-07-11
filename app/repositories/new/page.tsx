"use client";

import {
  FormEvent,
  useEffect,
  useState
} from "react";
import { useRouter } from "next/navigation";
import {
  Globe2,
  Lock,
  Plus
} from "lucide-react";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

export default function NewRepositoryPage() {
  const router = useRouter();

  const [ownerId, setOwnerId] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");
  const [visibility, setVisibility] = useState<
    "public" | "private"
  >("public");
  const [language, setLanguage] =
    useState("TypeScript");
  const [readme, setReadme] = useState(
    "# My Repository\n\nDescribe your project here."
  );

  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function initialize() {
      const supabase = createClient();

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth");
        return;
      }

      setOwnerId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, full_name")
        .eq("id", user.id)
        .single();

      setUsername(profile?.username ?? "");
      setFullName(profile?.full_name ?? "");

      setInitializing(false);
    }

    initialize();
  }, [router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!ownerId) {
      setError("You must be signed in.");
      return;
    }

    const slug = slugify(name);

    if (!slug) {
      setError(
        "Enter a valid repository name."
      );
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data, error: createError } =
      await supabase
        .from("repositories")
        .insert({
          owner_id: ownerId,
          name: name.trim(),
          slug,
          description:
            description.trim() || null,
          visibility,
          language,
          readme,
          default_branch: "main"
        })
        .select("id")
        .single();

    if (createError) {
      setError(
        createError.code === "23505"
          ? "A repository with this name already exists."
          : createError.message
      );

      setLoading(false);
      return;
    }

    router.push(`/repositories/${data.id}`);
    router.refresh();
  }

  if (initializing) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      <Header
        username={username}
        fullName={fullName}
      />

      <main className="main-content">
        <div className="page-container">
          <div className="section-header">
            <div>
              <h1>Create a new repository</h1>

              <p className="section-subtitle">
                A repository contains your project
                documentation and source-code metadata.
              </p>
            </div>
          </div>

          <section className="card form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="repositoryName"
                >
                  Repository name
                </label>

                <input
                  id="repositoryName"
                  className="input"
                  value={name}
                  onChange={(event) => {
                    const value =
                      event.target.value.replace(
                        /[^a-zA-Z0-9._ -]/g,
                        ""
                      );

                    setName(value);
                  }}
                  placeholder="doctigo-platform"
                  maxLength={100}
                  required
                />

                <p className="form-description">
                  Repository URL: /{username || "user"}/
                  {slugify(name) || "repository-name"}
                </p>
              </div>

              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="description"
                >
                  Description
                </label>

                <input
                  id="description"
                  className="input"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="A short description of your project"
                  maxLength={250}
                />
              </div>

              <div className="form-group">
                <span className="form-label">
                  Visibility
                </span>

                <div className="radio-group">
                  <label className="radio-card">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={
                        visibility === "public"
                      }
                      onChange={() =>
                        setVisibility("public")
                      }
                    />

                    <Globe2 size={20} />

                    <span>
                      <strong>Public</strong>
                      Anyone can view this repository.
                    </span>
                  </label>

                  <label className="radio-card">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={
                        visibility === "private"
                      }
                      onChange={() =>
                        setVisibility("private")
                      }
                    />

                    <Lock size={20} />

                    <span>
                      <strong>Private</strong>
                      Only you can view this repository.
                    </span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="language"
                >
                  Primary language
                </label>

                <select
                  id="language"
                  className="select"
                  value={language}
                  onChange={(event) =>
                    setLanguage(event.target.value)
                  }
                >
                  <option>TypeScript</option>
                  <option>JavaScript</option>
                  <option>Python</option>
                  <option>Java</option>
                  <option>C</option>
                  <option>C++</option>
                  <option>Go</option>
                  <option>Rust</option>
                  <option>HTML</option>
                  <option>CSS</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="readme"
                >
                  README
                </label>

                <textarea
                  id="readme"
                  className="textarea"
                  value={readme}
                  onChange={(event) =>
                    setReadme(event.target.value)
                  }
                  placeholder="# Repository README"
                />

                <p className="form-description">
                  Markdown formatting is supported.
                </p>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10
                }}
              >
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() =>
                    router.push("/dashboard")
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={loading}
                >
                  <Plus size={16} />

                  {loading
                    ? "Creating..."
                    : "Create repository"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
