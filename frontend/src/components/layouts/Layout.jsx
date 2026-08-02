import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MobileHeader from "./MobileHeader";
import MobileBottomNavigation from "./MobileBottomNavigation";
import SidebarNavigation from "./SidebarNavigation";

const TITLES = {
  "/": "Tableau de bord",
  "/presence": "Présence",
  "/taches": "Tâches",
  "/employes": "Employés",
  "/equipes": "Équipes",
  "/profil": "Profil",
};

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const title = TITLES[location.pathname] || "Suivi Employés";
  const isMainPath = Object.keys(TITLES).includes(location.pathname);

  return (
    <div className="min-h-screen flex bg-canvas">
      <MobileHeader title={title} showBackButton={!isMainPath} onBack={() => navigate(-1)} />

      <div className="hidden md:block">
        <SidebarNavigation onToggle={setIsSidebarCollapsed} />
      </div>

      <main
        className={`flex-1 max-w-full pt-16 md:pt-8 pb-20 md:pb-8 px-4 md:px-8 transition-all duration-300 ${
          isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Outlet />
      </main>

      <MobileBottomNavigation />
    </div>
  );
}
