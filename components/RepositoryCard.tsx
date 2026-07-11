import Link from "next/link";
import {
  Clock3,
  Lock,
  Star
} from "lucide-react";
import type { Repository } from "@/types/database";
import { formatRelativeDate } from "@/lib/utils";

interface RepositoryCardProps {
  repository: Repository;
}

export default function RepositoryCard({
  repository
}: RepositoryCardProps) {
  const starCount =
    repository.repository_stars?.length ?? 0;

  return (
    <article className="card repository-card">
      <div className="repository-card-header">
        <Link
          href={`/repositories/${repository.id}`}
          className="repository-name"
        >
          {repository.name}
        </Link>

        <span className="visibility-badge">
          {repository.visibility === "private" && (
            <Lock
              size={10}
              style={{
                marginRight: 4,
                verticalAlign: "middle"
              }}
            />
          )}

          {repository.visibility}
        </span>
      </div>

      <p className="repository-description">
        {repository.description ||
          "No repository description has been added."}
      </p>

      <div className="repository-meta">
        <span className="meta-item">
          <span className="language-dot" />
          {repository.language || "Other"}
        </span>

        <span className="meta-item">
          <Star size={14} />
          {starCount}
        </span>

        <span className="meta-item">
          <Clock3 size={14} />
          {formatRelativeDate(repository.updated_at)}
        </span>
      </div>
    </article>
  );
}
