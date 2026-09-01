import { useMemo } from 'react';
import { nanoid } from 'nanoid';
import { COLUMNS, STORAGE_KEY } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { ColumnId, Task, TaskDraft } from '../types';

const now = () => new Date().toISOString();

const SEED: Task[] = [
  {
    id: nanoid(),
    title: 'Configurar ambiente',
    subtitle: 'Instalar dependências e rodar o projeto',
    dueDate: null,
    assignee: 'Guilherme',
    priority: 'media',
    columnId: 'doing',
    order: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: nanoid(),
    title: 'Desenhar o quadro Kanban',
    subtitle: 'Colunas, cards e cores de prioridade',
    dueDate: null,
    assignee: 'Time',
    priority: 'alta',
    columnId: 'todo',
    order: 0,
    createdAt: now(),
    updatedAt: now(),
  },
];

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, SEED);

  const tasksByColumn = useMemo(() => {
    const map = {} as Record<ColumnId, Task[]>;
    for (const col of COLUMNS) map[col.id] = [];
    for (const task of tasks) {
      if (map[task.columnId]) map[task.columnId].push(task);
    }
    for (const col of COLUMNS) map[col.id].sort((a, b) => a.order - b.order);
    return map;
  }, [tasks]);

  function addTask(draft: TaskDraft) {
    setTasks((prev) => {
      const count = prev.filter((t) => t.columnId === draft.columnId).length;
      const ts = now();
      const task: Task = {
        ...draft,
        id: nanoid(),
        order: count,
        createdAt: ts,
        updatedAt: ts,
      };
      return [...prev, task];
    });
  }

  function updateTask(id: string, patch: Partial<TaskDraft>) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...patch, updatedAt: now() } : t,
      ),
    );
  }

  function deleteTask(id: string) {
    setTasks((prev) => {
      const removed = prev.find((t) => t.id === id);
      const rest = prev.filter((t) => t.id !== id);
      if (!removed) return rest;
      return rest.map((t) =>
        t.columnId === removed.columnId && t.order > removed.order
          ? { ...t, order: t.order - 1 }
          : t,
      );
    });
  }

  function moveTask(activeId: string, toColumn: ColumnId, toIndex: number) {
    setTasks((prev) => {
      const active = prev.find((t) => t.id === activeId);
      if (!active) return prev;

      const others = prev.filter((t) => t.id !== activeId);
      const targetColumn = others
        .filter((t) => t.columnId === toColumn)
        .sort((a, b) => a.order - b.order);

      const index = Math.max(0, Math.min(toIndex, targetColumn.length));
      targetColumn.splice(index, 0, { ...active, columnId: toColumn });

      const reindexed = targetColumn.map((t, i) => ({ ...t, order: i }));
      const untouched = others.filter((t) => t.columnId !== toColumn);
      return [...untouched, ...reindexed];
    });
  }

  return { tasks, tasksByColumn, addTask, updateTask, deleteTask, moveTask };
}
