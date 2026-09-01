export type Priority = 'baixa' | 'media' | 'alta' | 'urgente';

export type ColumnId = 'backlog' | 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  title: string;
  subtitle: string;
  dueDate: string | null; // ISO yyyy-mm-dd
  assignee: string;
  priority: Priority;
  columnId: ColumnId;
  order: number; // posição dentro da coluna
  createdAt: string;
  updatedAt: string;
}

export type TaskDraft = Omit<
  Task,
  'id' | 'order' | 'createdAt' | 'updatedAt'
>;
