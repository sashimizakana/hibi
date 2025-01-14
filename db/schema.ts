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
  name: text().primaryKey(),
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
