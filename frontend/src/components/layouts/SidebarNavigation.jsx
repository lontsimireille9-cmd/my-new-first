import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaClock, FaTasks, FaUsers, FaChevronLeft, FaChevronRight, FaLayerGroup, FaUserCog } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const BASE_NAV_ITEMS = [
  { path: "/", label: "Tableau de bord", icon: <FaHome /> },
  { path: "/presence", label: "Présence", icon: <FaClock /> },
  { path: "/taches", label: "Tâches", icon: <FaTasks /> },
  { path: "/equipes", label: "Équipes", icon: <FaLayerGroup /> },
  { path: "/profil", label: "Profil", icon: <FaUserCog /> },
];

const MANAGER_NAV_ITEM = { path: "/employes", label: "Employés", icon: <FaUsers /> };

export default function SidebarNavigation({ onToggle }) {
  const location = useLocation();
  const { profile, logout } = useAuth();
  const isManager = ["ADMIN", "MANAGER", "SUPER_ADMIN"].includes(profile?.role);
  const NAV_ITEMS = isManager ? [...BASE_NAV_ITEMS, MANAGER_NAV_ITEM] : BASE_NAV_ITEMS;
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    onToggle?.(isCollapsed);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed, onToggle]);

  const isActive = (path) => (path === "/" ? location.pathname === "/" : location.pathname.startsWith(path));

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-surface border-r border-line transition-all duration-300 z-40 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-5 border-b border-line relative flex items-center">
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-display text-sm flex-shrink-0">
          SE
        </div>
        {!isCollapsed && <span className="ml-3 font-display text-ink">Suivi Employés</span>}

        <button
          onClick={() => setIsCollapsed((c) => !c)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-surface border border-line rounded-full p-1.5 shadow-sm hover:shadow transition"
          title={isCollapsed ? "Étendre" : "Réduire"}
        >
          {isCollapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
        </button>
      </div>

      <nav className="p-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                title={isCollapsed ? item.label : ""}
                className={`flex items-center rounded-lg px-3 py-2.5 transition ${
                  isActive(item.path) ? "bg-primary/10 text-primary font-medium" : "text-ink/70 hover:bg-surface-2"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <span className="text-base">{item.icon}</span>
                {!isCollapsed && <span className="ml-3 text-sm">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`absolute bottom-0 left-0 right-0 border-t border-line p-4 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
        <div className={`flex items-center ${isCollapsed ? "flex-col gap-2" : "gap-3"}`}>
          <div className="w-9 h-9 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-semibold flex-shrink-0">
            {(profile?.name || "U").charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">{profile?.name}</p>
              <p className="text-xs text-muted">{profile?.role}</p>
            </div>
          )}
        </div>
        <button onClick={logout} className={`text-xs text-accent hover:underline ${isCollapsed ? "mt-2" : "mt-3"}`}>
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
