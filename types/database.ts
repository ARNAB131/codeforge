export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface RepositoryStar {
  id: string;
  repository_id: string;
  user_id: string;
  created_at: string;
}

export interface Repository {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  visibility: "public" | "private";
  language: string | null;
  readme: string | null;
  default_branch: string;
  created_at: string;
  updated_at: string;

  profiles?: Profile | null;

  repository_stars?: Array<{
    id: string;
    user_id?: string;
  }>;
}
