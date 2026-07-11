import Link from "next/link";
import { FolderGit2, Plus } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No repositories yet",
  description = "Create your first repository and start building something remarkable."
}: EmptyStateProps) {
  return (
    <div className="card empty-state">
      <div>
        <div
          className="empty-state-icon"
          style={{ margin: "0 auto" }}
        >
          <FolderGit2 size={25} />
        </div>

        <h3>{title}</h3>
        <p>{description}</p>

        <Link
          href="/repositories/new"
          className="button button-primary"
        >
          <Plus size={16} />
          Create repository
        </Link>
      </div>
    </div>
  );
}
