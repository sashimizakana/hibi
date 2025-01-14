import { atom } from "jotai";
import db from "@/db/db";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";

export const todoAtom = atom(
  async (get) => {
    return await db.select().from(todos).where(eq(todos.done, 0));
  },
  async (get, set, data: any) => {
    const [todo] = await db
      .insert(todos)
      .values(data)
      .onConflictDoUpdate({
        target: todos.id,
        set: data,
      })
      .returning();
    const list = [...(await get(todoAtom))];
    const index = list.findIndex((t) => t.id === todo.id);
    if (index > -1) {
      list.splice(index, 1, todo);
    } else {
      list.push(todo);
    }
    set(todoAtom, list);
  }
);
