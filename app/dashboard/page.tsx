import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FolderGit2,
  Plus,
  Star
} from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import RepositoryCard from "@/components/RepositoryCard";
import EmptyState from "@/components/EmptyState";
import { createClient } from "@/lib/supabase/server";
import type {
  Profile,
  Repository
} from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = profileData as Profile | null;

  const { data: repositoryData } = await supabase
    .from("repositories")
    .select(`
      *,
      profiles (*),
      repository_stars (id)
    `)
    .eq("owner_id", user.id)
    .order("updated_at", {
      ascending: false
    });

  const repositories =
    (repositoryData as Repository[] | null) ?? [];

  const totalStars = repositories.reduce(
    (total, repository) =>
      total +
      (repository.repository_stars?.length ?? 0),
    0
  );

  return (
    <>
      <Header
        username={profile?.username}
        fullName={profile?.full_name}
      />

      <main className="main-content">
        <div className="page-container dashboard-layout">
          <Sidebar active="dashboard" />

          <section>
            <div className="section-header">
              <div>
                <h1>
                  Welcome,{" "}
                  {profile?.full_name ||
                    profile?.username ||
                    "Developer"}
                </h1>

                <p className="section-subtitle">
                  Manage your repositories and monitor
                  your development activity.
                </p>
              </div>

              <Link
                href="/repositories/new"
                className="button button-primary"
              >
                <Plus size={16} />
                New repository
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(190px, 1fr))",
                gap: 16,
                marginBottom: 30
              }}
            >
              <div
                className="card"
                style={{ padding: 20 }}
              >
                <FolderGit2
                  size={20}
                  color="var(--accent-hover)"
                />

                <strong
                  style={{
                    display: "block",
                    marginTop: 16,
                    fontSize: 28
                  }}
                >
                  {repositories.length}
                </strong>

                <span
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 14
                  }}
                >
                  Total repositories
                </span>
              </div>

              <div
                className="card"
                style={{ padding: 20 }}
              >
                <Star
                  size={20}
                  color="var(--warning)"
                />

                <strong
                  style={{
                    display: "block",
                    marginTop: 16,
                    fontSize: 28
                  }}
                >
                  {totalStars}
                </strong>

                <span
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 14
                  }}
                >
                  Repository stars
                </span>
              </div>
            </div>

            <div
              className="section-header"
              id="repositories"
            >
              <div>
                <h2>Your repositories</h2>
                <p className="section-subtitle">
                  Recently updated projects.
                </p>
              </div>
            </div>

            {repositories.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="repository-grid">
                {repositories.map((repository) => (
                  <RepositoryCard
                    key={repository.id}
                    repository={repository}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
