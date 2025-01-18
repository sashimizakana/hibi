import { act, useCallback, useEffect, useState } from "react";
import { View, FlatList, ScrollView } from "react-native";
import dayjs from "dayjs";
import MonthHeader from "@/components/MonthHeader";
import DateRow from "@/components/DateRow";
import db from "@/db/db";
import { diaries } from "@/db/schema";
import { between } from "drizzle-orm";
import { useFocusEffect } from "expo-router";
import { DiariesAtom } from "@/atoms/diary";
import { useAtomValue } from "jotai";

export type CalendarDate = {
  label: string;
  date: string;
  day: string;
};

type CalendarProps = {
  ym: string;
  scrolling: boolean;
};

export default function Calendar({ ym, scrolling }: CalendarProps) {
  const date = dayjs(ym + "-01");
  const [calendar, setCalendar] = useState<CalendarDate[]>([]);
  const diaries = useAtomValue(DiariesAtom);
  useEffect(() => {
    const calendar = [];
    let cursor = dayjs(dayjs(ym + "-01").startOf("month"));
    while (cursor.format("YYYY-MM") === ym) {
      calendar.push({
        label: cursor.format("D"),
        date: cursor.format("YYYY-MM-DD"),
        day: cursor.format("ddd"),
      });
      cursor = cursor.add(1, "day");
    }
    setCalendar(calendar);
  }, []);
  function makeRow(item: CalendarDate) {
    return (
      <DateRow
        date={item}
        diary={diaries[item.date]}
        key={item.date}
        scrolling={scrolling}
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
