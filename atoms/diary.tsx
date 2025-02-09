import db from "@/db/db";
import _ from "lodash";
import { atomFamily, loadable, selectAtom } from "jotai/utils";
import { diaries } from "@/db/schema";
import { between, eq } from "drizzle-orm";
import { atom } from "jotai";
import dayjs from "dayjs";
import { fetchHolidaysAtom } from "./holiday";

export const DiariesAtom = atom<any>({});
export const fetchMonthDiariesAtom = atom(
  null,
  async (get, set, ym: string) => {
    const start = dayjs(`${ym}-01`).startOf("month").format("YYYY-MM-DD");
    const end = dayjs(`${ym}-01`).endOf("month").format("YYYY-MM-DD");
    const data = await db
      .select()
      .from(diaries)
      .where(between(diaries.date, start, end));
    await set(fetchHolidaysAtom, ym);
    set(DiariesAtom, {
      ...get(DiariesAtom),
      ...Object.fromEntries(data.map((d) => [d.date, d])),
    });
    return data;
  }
);
type InsertDiary = typeof diaries.$inferInsert;
async function saveDiary(data: InsertDiary) {
  const [diary] = await db
    .insert(diaries)
    .values(data)
    .onConflictDoUpdate({
      target: diaries.date,
      set: data,
    })
    .returning();
  return diary;
}
export const DiariesAtomFamily = atomFamily((date: string) =>
  atom(
    (get) => get(DiariesAtom)[date],
    (get, set, data: any) => {
      const diaries = get(DiariesAtom);
      const newData: InsertDiary = {
        ...get(DiariesAtom)[date],
        ...data,
        date,
      };
      set(DiariesAtom, { ...diaries, [date]: newData });
      saveDiary(newData);
    }
  )
);
