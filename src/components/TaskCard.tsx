import { forwardRef } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import { PriorityBadge } from './PriorityBadge';

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function formatDue(due: string | null) {
  if (!due) return null;
  const date = new Date(due + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return {
    text: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
    overdue: date < today,
  };
}

interface ViewProps extends HTMLAttributes<HTMLDivElement> {
  task: Task;
  dragging?: boolean;
  overlay?: boolean;
}

export const TaskCardView = forwardRef<HTMLDivElement, ViewProps>(
  ({ task, dragging, overlay, className, ...rest }, ref) => {
    const due = formatDue(task.dueDate);
    return (
      <div
        ref={ref}
        className={
          'card' +
          (dragging ? ' card--dragging' : '') +
          (overlay ? ' card--overlay' : '') +
          (className ? ' ' + className : '')
        }
        {...rest}
      >
        <div className="card__top">
          <PriorityBadge priority={task.priority} />
          {due && (
            <span className={'card__due' + (due.overdue ? ' card__due--overdue' : '')}>
              {due.text}
            </span>
          )}
        </div>
        <h3 className="card__title">{task.title}</h3>
        {task.subtitle && <p className="card__subtitle">{task.subtitle}</p>}
        <div className="card__bottom">
          <span
            className={'avatar' + (task.assignee ? '' : ' avatar--empty')}
            title={task.assignee || 'Sem responsável'}
          >
            {initials(task.assignee) || '?'}
          </span>
          <span className="card__assignee">{task.assignee || 'Sem responsável'}</span>
        </div>
      </div>
    );
  },
);
TaskCardView.displayName = 'TaskCardView';

export function TaskCard({
  task,
  onEdit,
}: {
  task: Task;
  onEdit: (task: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <TaskCardView
      ref={setNodeRef}
      task={task}
      dragging={isDragging}
      style={style}
      onClick={() => onEdit(task)}
      {...attributes}
      {...listeners}
    />
  );
}
