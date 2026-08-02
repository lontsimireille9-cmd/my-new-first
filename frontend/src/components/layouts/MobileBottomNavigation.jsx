import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaClock, FaTasks, FaUsers, FaLayerGroup, FaUserCog } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const BASE_TABS = [
  { path: "/", label: "Accueil", icon: <FaHome /> },
  { path: "/presence", label: "Présence", icon: <FaClock /> },
  { path: "/taches", label: "Tâches", icon: <FaTasks /> },
  { path: "/equipes", label: "Équipes", icon: <FaLayerGroup /> },
  { path: "/profil", label: "Profil", icon: <FaUserCog /> },
];

const MANAGER_TAB = { path: "/employes", label: "Employés", icon: <FaUsers /> };

export default function MobileBottomNavigation() {
  const location = useLocation();
  const { profile } = useAuth();
  const isManager = ["ADMIN", "MANAGER", "SUPER_ADMIN"].includes(profile?.role);
  const TABS = isManager ? [...BASE_TABS, MANAGER_TAB] : BASE_TABS;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-line shadow-lg">
      <div className="flex justify-around items-center h-16">
        {TABS.map((tab) => {
          const isActive = tab.path === "/" ? location.pathname === "/" : location.pathname.startsWith(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center p-2 flex-1 ${isActive ? "text-primary font-semibold" : "text-ink/60"}`}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              <span className="text-xs mt-1 leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
