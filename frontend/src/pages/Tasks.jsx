import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/button";
import Card from "../components/ui/card";
import Input from "../components/ui/input";
import Select from "../components/ui/select";
import Title from "../components/ui/title";
import Badge from "../components/ui/badge";
import TaskStatusHistory from "../components/tasks/TaskStatusHistory";
import { getTaskStatusColor } from "../utils/getTaskDisplayStatus";

const STATUSES = ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED", "REJECTED", "CANCELLED"];

export default function Tasks() {
  const { profile } = useAuth();
  const isManager = ["MANAGER", "ADMIN", "SUPER_ADMIN"].includes(profile?.role);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [form, setForm] = useState({ title: "", assigneeId: "", priority: "MEDIUM", projectId: "" });

  function load() {
    api.get("/tasks").then(setTasks).catch(() => {});
    api.get("/projects").then(setProjects).catch(() => setProjects([]));
  }

  useEffect(load, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title || !form.assigneeId) return;
    await api.post("/tasks", form);
    setForm({ title: "", assigneeId: "", priority: "MEDIUM", projectId: "" });
    load();
  }

  async function handleStatusChange(id, status) {
    await api.patch(`/tasks/${id}/status`, { status });
    load();
  }

  return (
    <div>
      <Title as="h1" variant="page" className="mb-1">
        Tâches
      </Title>
      <p className="text-sm text-muted mb-8">
        {isManager ? "Créez et suivez les tâches de votre équipe." : "Vos tâches assignées."}
      </p>

      {isManager && (
        <Card className="mb-8">
          <form onSubmit={handleCreate} className="flex flex-wrap gap-3 items-end">
            <div className="w-56">
              <Input
                id="title"
                label="Titre"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Nouvelle tâche"
              />
            </div>
            <div className="w-40">
              <Input
                id="assigneeId"
                label="ID employé"
                value={form.assigneeId}
                onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
                placeholder="uid Firebase"
              />
            </div>
            <div className="w-36">
              <label className="block text-sm font-medium mb-1.5 text-ink/70">Priorité</label>
              <Select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                options={[
                  { value: "LOW", label: "Basse" },
                  { value: "MEDIUM", label: "Moyenne" },
                  { value: "HIGH", label: "Haute" },
                  { value: "URGENT", label: "Urgente" },
                ]}
              />
            </div>
            <div className="w-44">
              <label className="block text-sm font-medium mb-1.5 text-ink/70">Projet</label>
              <Select
                value={form.projectId}
                onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                options={[{ value: "", label: "Sans projet" }, ...projects.map((project) => ({ value: project.id, label: project.name }))]}
              />
            </div>
            <Button type="submit">Créer</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {projects.map((project) => {
          const projectTasks = tasks.filter((task) => task.projectId === project.id);
          const overdue = projectTasks.filter((task) => task.status !== "COMPLETED" && task.deadline && new Date(task.deadline) < new Date()).length;
          return (
            <Card key={project.id} className="cursor-pointer" onClick={() => setSelectedProject(project.id === selectedProject ? null : project.id)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">{project.name}</p>
                  <p className="text-xs text-muted">{projectTasks.length} tâche(s)</p>
                </div>
                <Badge tone={overdue > 0 ? "warning" : "success"}>{overdue > 0 ? `${overdue} retard` : "À l’heure"}</Badge>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="space-y-3">
        {tasks.map((t) => (
          <Card key={t.id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">{t.title}</p>
                <p className="text-xs text-muted">Priorité : {t.priority} • Assigné à {t.assigneeName || t.assigneeId}</p>
                {t.projectName && <p className="text-xs text-muted">Projet : {t.projectName}</p>}
              </div>
              <div className="flex items-center gap-3">
                <Badge className={`border ${getTaskStatusColor(t.status)}`}>{t.status}</Badge>
                <Select
                  value={t.status}
                  onChange={(e) => handleStatusChange(t.id, e.target.value)}
                  className="!w-auto text-xs py-1.5"
                  options={STATUSES.map((s) => ({ value: s, label: s }))}
                />
                <button
                  onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                  className="text-xs text-primary hover:underline"
                >
                  {expandedId === t.id ? "Fermer" : "Historique"}
                </button>
              </div>
            </div>

            {expandedId === t.id && (
              <div className="mt-4">
                <TaskStatusHistory task={t} />
              </div>
            )}

            {selectedProject && t.projectId === selectedProject && (
              <div className="mt-4 rounded-lg border border-line bg-surface-2 p-3 text-sm text-muted">
                <p className="font-medium text-ink">État de l’avancement</p>
                <p>{t.status}</p>
                {t.deadline && <p className="mt-1">Échéance : {new Date(t.deadline).toLocaleDateString()}</p>}
              </div>
            )}
          </Card>
        ))}
        {tasks.length === 0 && <p className="text-sm text-muted">Aucune tâche pour le moment.</p>}
      </div>
    </div>
  );
}
