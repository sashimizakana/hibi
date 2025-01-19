import { atom } from "jotai";
import db from "@/db/db";
import { todos } from "@/db/schema";
import { eq, or, between } from "drizzle-orm";
import dayjs from "dayjs";

type Todo = typeof todos.$inferSelect;

export const todosAtom = atom<Todo[]>([]);
export const fetchTodosAtom = atom(null, async (get, set, date: string) => {
  const start = dayjs(date).startOf("day").toISOString();
  const end = dayjs(date).endOf("day").toISOString();
  // 終わってないものか、その日に終了したものを取得する
  const data = await db
    .select()
    .from(todos)
    .where(or(eq(todos.done, 0), between(todos.date, start, end)));
  set(todosAtom, data);
});

export const deleteTodoAtom = atom(null, async (get, set, id: number) => {
  await db.delete(todos).where(eq(todos.id, id));
  const list = get(todosAtom).filter((t) => t.id !== id);
  set(todosAtom, list);
});

export const saveTodoAtom = atom(
  null,
  async (get, set, data: typeof todos.$inferInsert) => {
    const [todo] = await db
      .insert(todos)
      .values(data)
      .onConflictDoUpdate({
        target: todos.id,
        set: data,
      })
      .returning();
    const list = [...get(todosAtom)];
    const index = list.findIndex((t) => t.id === todo.id);
    if (index > -1) {
      list.splice(index, 1, todo);
    } else {
      list.push(todo);
    }
    set(todosAtom, list);
  }
);
