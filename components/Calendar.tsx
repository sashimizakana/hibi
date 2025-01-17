import { act, useCallback, useEffect, useState } from "react";
import { View, FlatList, ScrollView } from "react-native";
import dayjs from "dayjs";
import MonthHeader from "@/components/MonthHeader";
import DateRow from "@/components/DateRow";
import db from "@/db/db";
import { diaries } from "@/db/schema";
import { between } from "drizzle-orm";
import { useFocusEffect } from "expo-router";

export type CalendarDate = {
  label: string;
  date: string;
  day: string;
};

type CalendarProps = {
  ym: string;
};

export default function Calendar({ ym }: CalendarProps) {
  const date = dayjs(ym + "-01");
  const [calendar, setCalendar] = useState<CalendarDate[]>([]);
  const [diaryMap, setDiaryMap] = useState<Map<string, any>>(new Map());
  async function loadDiaries() {
    const start = dayjs(`${ym}-01`).startOf("month").format("YYYY-MM-DD");
    const end = dayjs(`${ym}-01`).endOf("month").format("YYYY-MM-DD");
    const data = await db
      .select()
      .from(diaries)
      .where(between(diaries.date, start, end));
    const map = new Map();
    data.forEach((diary) => {
      map.set(diary.date, diary);
    });
    setDiaryMap(map);
  }
  useEffect(() => {
    const calendar = [];
    let cursor = dayjs(dayjs(ym + "-01").startOf("month"));
    while (cursor.format("YYYY-MM") === ym) {
      calendar.push({
        label: cursor.format("D"),
        date: cursor.format("YYYY-MM-DD"),
        day: cursor.format("ddd"),
        diary: diaryMap.get(cursor.format("YYYY-MM-DD")),
      });
      cursor = cursor.add(1, "day");
    }
    setCalendar(calendar);
  }, []);
  useFocusEffect(
    useCallback(() => {
      loadDiaries();
    }, [])
  );
  function makeRow(item: CalendarDate) {
    return (
      <DateRow
        date={item}
        diary={diaryMap.get(item.date)}
        key={item.date}
      ></DateRow>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <MonthHeader>{date.format("YYYY年MM月")}</MonthHeader>
      <ScrollView style={{ flex: 1 }}>
        {calendar.map((v) => makeRow(v))}
      </ScrollView>
    </View>
  );
}
