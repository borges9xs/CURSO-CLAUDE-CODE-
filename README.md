# Kanban de Tarefas

Plataforma simples de gestão de tarefas com quadro Kanban.

## Stack

- React 18 + TypeScript + Vite
- @dnd-kit para o drag-and-drop (fluido e acessível)
- Persistência em `localStorage` (sem backend)

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # checa tipos + build de produção em dist/
```

## Funcionalidades

- Criar tarefa com título, subtítulo, prazo, responsável e prioridade
- Editar / excluir clicando no card
- Arrastar cards entre as 4 etapas (Backlog, A fazer, Em andamento, Concluído)
- Reordenar cards dentro da mesma coluna
- Estado salvo automaticamente no navegador

## Estrutura

```
src/
├── App.tsx                 # layout + estado do modal
├── types.ts / constants.ts
├── hooks/useLocalStorage.ts
├── store/useTasks.ts       # CRUD + moveTask
└── components/
    ├── Board.tsx           # DndContext, DragOverlay
    ├── Column.tsx          # droppable + SortableContext
    ├── TaskCard.tsx        # card sortable + view presentacional
    ├── TaskDialog.tsx      # modal criar/editar
    └── PriorityBadge.tsx
```
