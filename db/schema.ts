import {
  sqliteTable,
  index,
  uniqueIndex,
  integer,
  text,
} from "drizzle-orm/sqlite-core";

export const diaries = sqliteTable(
  "diaries",
  {
    date: text().primaryKey(),
    text: text(),
    marks: text({ mode: "json" }),
    tasks: text({ mode: "json" }),
  },
  (table) => [uniqueIndex("diaries_date_idx").on(table.date)]
);

export const tasks = sqliteTable("tasks", {
  id: integer().primaryKey(),
  name: text(),
});

export const todos = sqliteTable(
  "todos",
  {
    id: integer().primaryKey(),
    task: text(),
    done: integer(),
    date: text(),
  },
  (table) => [index("todos_date_idx").on(table.date)]
);

export const configs = sqliteTable("configs", {
  name: text().primaryKey(),
  data: text({ mode: "json" }),
});
