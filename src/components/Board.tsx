import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { COLUMNS } from '../constants';
import type { ColumnId, Task } from '../types';
import { Column } from './Column';
import { TaskCardView } from './TaskCard';

interface Props {
  tasksByColumn: Record<ColumnId, Task[]>;
  moveTask: (activeId: string, toColumn: ColumnId, toIndex: number) => void;
  onAdd: (columnId: ColumnId) => void;
  onEdit: (task: Task) => void;
}

export function Board({ tasksByColumn, moveTask, onAdd, onEdit }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const allTasks = COLUMNS.flatMap((c) => tasksByColumn[c.id]);

  function columnOf(id: string): ColumnId | undefined {
    if (COLUMNS.some((c) => c.id === id)) return id as ColumnId;
    return allTasks.find((t) => t.id === id)?.columnId;
  }

  function targetIndex(overId: string, column: ColumnId): number {
    const list = tasksByColumn[column];
    const idx = list.findIndex((t) => t.id === overId);
    return idx >= 0 ? idx : list.length;
  }

  function handleStart(e: DragStartEvent) {
    setActiveTask(allTasks.find((t) => t.id === e.active.id) ?? null);
  }

  function handleOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;
    const from = columnOf(String(active.id));
    const to = columnOf(String(over.id));
    if (!from || !to || from === to) return;
    moveTask(String(active.id), to, targetIndex(String(over.id), to));
  }

  function handleEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveTask(null);
    if (!over) return;
    const to = columnOf(String(over.id));
    if (!to) return;
    moveTask(String(active.id), to, targetIndex(String(over.id), to));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleStart}
      onDragOver={handleOver}
      onDragEnd={handleEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="board">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={tasksByColumn[col.id]}
            onAdd={onAdd}
            onEdit={onEdit}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.2, 0, 0, 1)' }}>
        {activeTask ? <TaskCardView task={activeTask} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
