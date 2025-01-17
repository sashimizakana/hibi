import db from "@/db/db";
import { diaries } from "@/db/schema";
import { between, eq } from "drizzle-orm";
import { atom } from "jotai";
import { atomWithRefresh } from "jotai/utils";
import dayjs from "dayjs";

export const DiaryMonthAtom = atom(dayjs().format("YYYY-MM"));
export const MonthDiariesAtom = atomWithRefresh(async (get) => {
  const ym = get(DiaryMonthAtom);
  const start = dayjs(`${ym}-01`)
    .subtract(2, "months")
    .startOf("month")
    .format("YYYY-MM-DD");
  const end = dayjs(`${ym}-01`)
    .add(2, "months")
    .endOf("month")
    .format("YYYY-MM-DD");
  console.log(start, end);
  return await db
    .select()
    .from(diaries)
    .where(between(diaries.date, start, end));
});

export const DayDiaryAtom = atom(dayjs().format("YYYY-MM-DD"));
export const DiaryAtom = atom(
  async (get) => {
    const date = get(DayDiaryAtom);
    if (!date) {
      return;
    }
    return (await db.select().from(diaries).where(eq(diaries.date, date))).at(
      0
    );
  },
  async (get, set, data: any) => {
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
);
