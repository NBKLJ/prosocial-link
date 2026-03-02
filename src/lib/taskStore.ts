export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: string;
  tags: string[];
  fromMessage?: string;
  fromContact?: string;
  createdAt: string;
}

const STORAGE_KEY = "birdly_tasks";

const defaultTasks: Task[] = [
  { id: "1", title: "Follow-up com cliente MegaCorp", description: "Enviar proposta revisada", status: "todo", priority: "high", assignee: "Carlos", dueDate: "2026-03-05", tags: ["vendas", "urgente"], createdAt: "2026-03-01T10:00:00" },
  { id: "2", title: "Preparar apresentação Q1", description: "Relatório trimestral de vendas", status: "in_progress", priority: "medium", assignee: "Ana", dueDate: "2026-03-10", tags: ["relatório"], createdAt: "2026-03-01T11:00:00" },
  { id: "3", title: "Atualizar base de contatos", description: "Limpar leads inativos há 90 dias", status: "todo", priority: "low", assignee: "João", dueDate: "2026-03-15", tags: ["operacional"], createdAt: "2026-03-01T12:00:00" },
  { id: "4", title: "Configurar automação de boas-vindas", description: "Novo fluxo para leads do site", status: "done", priority: "medium", assignee: "Carlos", dueDate: "2026-03-01", tags: ["automação"], createdAt: "2026-02-28T09:00:00" },
  { id: "5", title: "Reunião com equipe comercial", description: "Alinhamento de metas mensais", status: "in_progress", priority: "high", assignee: "Ana", dueDate: "2026-03-03", tags: ["reunião"], createdAt: "2026-03-01T08:00:00" },
  { id: "6", title: "Revisar contratos pendentes", description: "3 contratos aguardando assinatura", status: "todo", priority: "high", assignee: "João", dueDate: "2026-03-04", tags: ["contratos", "urgente"], createdAt: "2026-03-01T14:00:00" },
];

export function getTaskStore(): Task[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTasks));
  return defaultTasks;
}

export function saveTaskStore(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function addTask(task: Omit<Task, "id" | "createdAt">): Task {
  const tasks = getTaskStore();
  const newTask: Task = {
    ...task,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTaskStore(tasks);
  return newTask;
}

export function updateTaskStatus(id: string, status: Task["status"]) {
  const tasks = getTaskStore();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx >= 0) {
    tasks[idx].status = status;
    saveTaskStore(tasks);
  }
}

export const availableAssignees = ["Carlos", "Ana", "João", "Julia"];
