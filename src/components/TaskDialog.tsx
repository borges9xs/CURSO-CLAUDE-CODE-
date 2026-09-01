import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { COLUMNS, PRIORITIES } from '../constants';
import type { ColumnId, Priority, Task, TaskDraft } from '../types';

interface Props {
  open: boolean;
  task: Task | null; // null => modo criação
  defaultColumn: ColumnId;
  onClose: () => void;
  onSave: (draft: TaskDraft, id: string | null) => void;
  onDelete: (id: string) => void;
}

const emptyForm = (columnId: ColumnId): TaskDraft => ({
  title: '',
  subtitle: '',
  dueDate: null,
  assignee: '',
  priority: 'media',
  columnId,
});

export function TaskDialog({
  open,
  task,
  defaultColumn,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [form, setForm] = useState<TaskDraft>(emptyForm(defaultColumn));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    setForm(
      task
        ? {
            title: task.title,
            subtitle: task.subtitle,
            dueDate: task.dueDate,
            assignee: task.assignee,
            priority: task.priority,
            columnId: task.columnId,
          }
        : emptyForm(defaultColumn),
    );
  }, [open, task, defaultColumn]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('O título é obrigatório.');
      return;
    }
    onSave({ ...form, title: form.title.trim() }, task?.id ?? null);
  }

  function set<K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="overlay" onMouseDown={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-label={task ? 'Editar tarefa' : 'Nova tarefa'}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="dialog__title">{task ? 'Editar tarefa' : 'Nova tarefa'}</h2>

        <form className="form" onSubmit={submit}>
          <label className="field">
            <span>Título *</span>
            <input
              autoFocus
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Ex.: Implementar login"
            />
          </label>

          <label className="field">
            <span>Subtítulo</span>
            <input
              value={form.subtitle}
              onChange={(e) => set('subtitle', e.target.value)}
              placeholder="Descrição curta"
            />
          </label>

          <div className="form__row">
            <label className="field">
              <span>Prazo</span>
              <input
                type="date"
                value={form.dueDate ?? ''}
                onChange={(e) => set('dueDate', e.target.value || null)}
              />
            </label>

            <label className="field">
              <span>Responsável</span>
              <input
                value={form.assignee}
                onChange={(e) => set('assignee', e.target.value)}
                placeholder="Nome"
              />
            </label>
          </div>

          <div className="form__row">
            <label className="field">
              <span>Prioridade</span>
              <select
                value={form.priority}
                onChange={(e) => set('priority', e.target.value as Priority)}
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Etapa</span>
              <select
                value={form.columnId}
                onChange={(e) => set('columnId', e.target.value as ColumnId)}
              >
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && <p className="form__error">{error}</p>}

          <div className="dialog__actions">
            {task && (
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => onDelete(task.id)}
              >
                Excluir
              </button>
            )}
            <div className="dialog__actions-right">
              <button type="button" className="btn btn--ghost" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary">
                {task ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
