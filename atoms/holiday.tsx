import db from "@/db/db";
import _ from "lodash";
import { fetch } from "expo/fetch";
import { diaries } from "@/db/schema";
import { between, desc, eq, like } from "drizzle-orm";
import { atom } from "jotai";
import dayjs from "dayjs";
import { holidays } from "@/db/schema";
import { atomFamily } from "jotai/utils";

export const HolidaysAtom = atom<any>({});
export const fetchHolidaysAtom = atom(null, async (get, set, ym: string) => {
  const start = dayjs(`${ym}-01`).startOf("month").format("YYYY-MM-DD");
  const end = dayjs(`${ym}-01`).endOf("month").format("YYYY-MM-DD");
  const data = await db
    .select()
    .from(holidays)
    .where(between(holidays.date, start, end));
  set(HolidaysAtom, {
    ...get(HolidaysAtom),

    ...Object.fromEntries(data.map((d) => [d.date, d])),
  });
  return data;
});
export const loadHolidaysAtom = atom(null, async (get, set, year: string) => {
  try {
    const data = await db
      .select()
      .from(holidays)
      .where(like(holidays.date, `${year}%`))
      .limit(1);
    if (data.length) {
      return;
    }
    const res = await fetch(
      `https://holidays-jp.github.io/api/v1/${year}/date.json`
    );
    const json = await res.json();
    const items = Object.entries(json).map(([date, name]) => ({
      date,
      name,
    }));
    await db.insert(holidays).values(items);
    set(HolidaysAtom, {
      ...get(HolidaysAtom),
      ...Object.fromEntries(items.map((d) => [d.date, d])),
    });
    return data;
  } catch (e) {
    console.error(e);
  }
});
export const HolidaysAtomFamily = atomFamily((date: string) =>
  atom((get) => get(HolidaysAtom)[date])
);
