import db from "@/db/db";
import { diaries } from "@/db/schema";
import { between } from "drizzle-orm";
import { useState } from "react";
import dayjs from "dayjs";

type Diary = {
  date: string;
  text: string | null;
  marks: Array<string> | null;
  tasks: Array<string> | null;
};

export const useDiary = () => {
  async function loadMonth(ym: string) {
    const start = dayjs(`${ym}-01`).startOf("month").format("YYYY-MM-DD");
    const end = dayjs(`${ym}-01`).endOf("month").format("YYYY-MM-DD");
    return await db
      .select()
      .from(diaries)
      .where(between(diaries.date, start, end));
  }
  async function saveDiary(diary: Diary) {
    console.log(diary);
    console.log(
      await db.insert(diaries).values(diary).onConflictDoUpdate({
        target: diaries.date,
        set: diary,
      })
    );
  }
  return { loadMonth, saveDiary };
};
