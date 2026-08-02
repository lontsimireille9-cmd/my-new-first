/**
 * Labels et couleurs d'affichage pour le statut des tâches.
 * Basé sur l'ENUM TaskStatus du projet.
 */
const STATUS_LABELS = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  REVIEW: "En révision",
  COMPLETED: "Terminée",
  REJECTED: "Rejetée",
  CANCELLED: "Annulée",
};

const STATUS_COLORS = {
  TODO: "bg-surface-2 text-ink/70 border-line",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
  REVIEW: "bg-amber-100 text-amber-800 border-amber-200",
  COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",
};

export function getTaskStatusLabel(status) {
  return STATUS_LABELS[status] || status;
}

export function getTaskStatusColor(status) {
  return STATUS_COLORS[status] || "bg-surface-2 text-ink/70 border-line";
}
