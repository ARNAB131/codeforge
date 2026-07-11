"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Code2,
  LogOut,
  Plus,
  Search
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";

interface HeaderProps {
  username?: string | null;
  fullName?: string | null;
}

export default function Header({
  username,
  fullName
}: HeaderProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/");
    router.refresh();
  }

  return (
    <header className="header">
      <div className="page-container header-content">
        <Link href="/dashboard" className="brand">
          <span className="brand-icon">
            <Code2 size={21} />
          </span>

          <span>CodeForge</span>
        </Link>

        <div className="header-search">
          <Search size={16} />

          <input
            className="input"
            placeholder="Search repositories..."
            aria-label="Search repositories"
          />
        </div>

        <div className="header-actions">
          <Link
            href="/repositories/new"
            className="button button-secondary"
          >
            <Plus size={16} />
            <span className="header-label">
              New repository
            </span>
          </Link>

          <div
            className="avatar"
            title={username ?? "Account"}
          >
            {getInitials(fullName ?? username)}
          </div>

          <button
            type="button"
            className="button button-secondary"
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
