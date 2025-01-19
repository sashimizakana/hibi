import { atom } from "jotai";
import db from "@/db/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

type Task = typeof tasks.$inferSelect;
export const tasksAtom = atom<Task[]>([]);
export const fetchTasksAtom = atom(null, async (get, set) => {
  const data = await db.select().from(tasks);
  set(tasksAtom, data);
});

export const deleteTaskAtom = atom(null, async (get, set, id: number) => {
  await db.delete(tasks).where(eq(tasks.id, id));
  const list = get(tasksAtom).filter((t) => t.id !== id);
  set(tasksAtom, list);
});

export const saveTaskAtom = atom(
  null,
  async (get, set, data: typeof tasks.$inferInsert) => {
    const [task] = await db
      .insert(tasks)
      .values(data)
      .onConflictDoUpdate({
        target: tasks.id,
        set: data,
      })
      .returning();
    const list = [...get(tasksAtom)];
    const index = list.findIndex((t) => t.id === task.id);
    if (index > -1) {
      list.splice(index, 1, task);
    } else {
      list.push(task);
    }
    set(tasksAtom, list);
  }
);
