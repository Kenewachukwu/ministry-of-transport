"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ExternalLink, GripVertical } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/design-system/primitives/Button";
import { RowAction } from "./RowAction";
import { cn } from "@/lib/utils";
import type { ActionState } from "@/lib/admin/action";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

export interface ReorderItem {
  id: string;
  title: string;
  subtitle?: string | null;
  editHref: string;
  viewHref?: string | null;
}

function SaveButton({ dirty }: { dirty: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending || !dirty}>
      {pending ? "Saving…" : "Save new order"}
    </Button>
  );
}

const arrow =
  "flex h-8 w-8 items-center justify-center rounded-control border border-border text-ink transition-colors hover:border-cta hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta disabled:opacity-30";

/**
 * Re-arrange with Up / Down buttons (works with a keyboard and on touch screens,
 * no drag-and-drop needed). Nothing changes on the website until "Save new
 * order" is pressed.
 */
export function ReorderList({
  items,
  reorderAction,
  archiveAction,
  singular,
}: {
  items: ReorderItem[];
  reorderAction: Action;
  archiveAction: Action;
  singular: string;
}) {
  const [order, setOrder] = useState(items.map((i) => i.id));
  const byId = new Map(items.map((i) => [i.id, i]));
  const [state, formAction] = useActionState(reorderAction, {} as ActionState);
  const dirty = order.join() !== items.map((i) => i.id).join();

  const move = (from: number, to: number) =>
    setOrder((o) => {
      if (to < 0 || to >= o.length) return o;
      const next = [...o];
      const [x] = next.splice(from, 1);
      next.splice(to, 0, x);
      return next;
    });

  return (
    <div>
      <ol className="flex flex-col gap-2">
        {order.map((id, i) => {
          const item = byId.get(id);
          if (!item) return null;
          return (
            <li key={id} className="flex flex-col gap-2.5 rounded-control border border-border bg-surface-raised px-3 py-2.5 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <GripVertical size={16} aria-hidden className="shrink-0 text-ink-muted/50" />
                <span className="w-6 shrink-0 text-center text-xs font-semibold text-ink-muted">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <Link href={item.editHref} className="block truncate text-sm font-semibold text-ink hover:text-cta focus-visible:text-cta">
                    {item.title}
                  </Link>
                  {item.subtitle && <p className="truncate text-xs text-ink-muted">{item.subtitle}</p>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pl-9 sm:pl-0">
                <div className="flex items-center gap-1.5">
                  <button type="button" className={arrow} onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move “${item.title}” up`}>
                    <ArrowUp size={15} aria-hidden />
                  </button>
                  <button type="button" className={arrow} onClick={() => move(i, i + 1)} disabled={i === order.length - 1} aria-label={`Move “${item.title}” down`}>
                    <ArrowDown size={15} aria-hidden />
                  </button>
                </div>
                <Link href={item.editHref} className="rounded-control border border-border px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-cta hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta">
                  Edit
                </Link>
                {item.viewHref && (
                  <Link href={item.viewHref} target="_blank" aria-label={`View “${item.title}” on the website`} className="rounded-control border border-border p-1.5 text-ink-muted hover:border-cta hover:text-cta">
                    <ExternalLink size={14} aria-hidden />
                  </Link>
                )}
                <RowAction action={archiveAction} id={id} label="Archive" tone="danger" confirmMessage={`Archive this ${singular}? It will disappear from the website, but you can restore it later.`} />
              </div>
            </li>
          );
        })}
      </ol>

      <form action={formAction} className="mt-5 flex flex-wrap items-center gap-3">
        <input type="hidden" name="order" value={JSON.stringify(order)} />
        <SaveButton dirty={dirty} />
        {dirty && <span className="text-xs text-amber-800">You have unsaved changes to the order.</span>}
        {state.error && (
          <span role="alert" className="text-sm font-medium text-red-700">
            {state.error}
          </span>
        )}
        {state.message && !dirty && (
          <span role="status" className={cn("text-sm font-medium text-brand-700")}>
            {state.message}
          </span>
        )}
      </form>
    </div>
  );
}
