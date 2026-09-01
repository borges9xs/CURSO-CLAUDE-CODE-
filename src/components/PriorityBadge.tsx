import { PRIORITIES } from '../constants';
import type { Priority } from '../types';

export function PriorityBadge({ priority }: { priority: Priority }) {
  const label = PRIORITIES.find((p) => p.value === priority)?.label ?? priority;
  return (
    <span className={`badge badge--${priority}`}>
      <span className="badge__dot" aria-hidden />
      {label}
    </span>
  );
}
