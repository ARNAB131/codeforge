import Link from "next/link";
import {
  BookMarked,
  FolderGit2,
  LayoutDashboard,
  Settings,
  Star
} from "lucide-react";

interface SidebarProps {
  active?: "dashboard" | "repositories" | "stars" | "settings";
}

export default function Sidebar({
  active = "dashboard"
}: SidebarProps) {
  const links = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard
    },
    {
      id: "repositories",
      label: "Repositories",
      href: "/dashboard#repositories",
      icon: FolderGit2
    },
    {
      id: "stars",
      label: "Stars",
      href: "/dashboard#stars",
      icon: Star
    },
    {
      id: "settings",
      label: "Settings",
      href: "/dashboard#settings",
      icon: Settings
    }
  ];

  return (
    <aside className="sidebar">
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <Link
            key={link.id}
            href={link.href}
            className={`sidebar-link ${
              active === link.id
                ? "sidebar-link-active"
                : ""
            }`}
          >
            <Icon size={17} />
            {link.label}
          </Link>
        );
      })}

      <Link
        href="/repositories/new"
        className="sidebar-link"
      >
        <BookMarked size={17} />
        Create repository
      </Link>
    </aside>
  );
}
