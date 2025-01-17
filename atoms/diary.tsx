import db from "@/db/db";
import { loadable } from "jotai/utils";
import { diaries } from "@/db/schema";
import { between, eq } from "drizzle-orm";
import { atom } from "jotai";
import { atomWithRefresh } from "jotai/utils";
import dayjs from "dayjs";

export const DiariesAtom = atom<any>({});
export const LoadedMonthAtom = atom<string[]>([]);
export const fetchMonthDiariesAtom = atom(
  null,
  async (get, set, ym: string) => {
    set(LoadedMonthAtom, [...get(LoadedMonthAtom), ym]);
    const start = dayjs(`${ym}-01`).startOf("month").format("YYYY-MM-DD");
    const end = dayjs(`${ym}-01`).endOf("month").format("YYYY-MM-DD");
    const data = await db
      .select()
      .from(diaries)
      .where(between(diaries.date, start, end));
    set(DiariesAtom, {
      ...get(DiariesAtom),
      ...Object.fromEntries(data.map((d) => [d.date, d])),
    });
    return data;
  }
);

export const DayDiaryAtom = atom(dayjs().format("YYYY-MM-DD"));
export const DiaryAtom = atom(
  async (get) => {
    return get(DiariesAtom)[get(DayDiaryAtom)];
  },
  async (get, set, data: any) => {
    set(DiariesAtom, {
      ...get(DiariesAtom),
      [data.date]: data,
    });
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
