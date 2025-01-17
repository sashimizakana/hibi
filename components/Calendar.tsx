import { useCallback, useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import dayjs from "dayjs";
import MonthHeader from "@/components/MonthHeader";
import DateRow from "@/components/DateRow";
import { useAtom, useAtomValue } from "jotai";
import { DiaryMonthAtom, MonthDiariesAtom } from "@/atoms/diary";
import { useFocusEffect } from "expo-router";

export type CalendarDate = {
  label: string;
  date: string;
  day: string;
  diary: any;
};

type CalendarProps = {
  ym: string;
};

export default function Calendar({ ym }: CalendarProps) {
  const [date, setDate] = useState(dayjs(ym + "-01").startOf("month"));
  const [calendar, setCalendar] = useState<CalendarDate[]>([]);
  const diaries = useAtomValue(MonthDiariesAtom);
  useEffect(() => {
    const calendar = [];
    let cursor = dayjs(date);
    while (cursor.format("YYYYMM") === date.format("YYYYMM")) {
      calendar.push({
        label: cursor.format("D"),
        date: cursor.format("YYYY-MM-DD"),
        day: cursor.format("ddd"),
        diary: diaries.find((t) => t.date === cursor.format("YYYY-MM-DD")),
      });
      cursor = cursor.add(1, "day");
    }
    setCalendar(calendar);
  }, [diaries]);
  return (
    <View style={{ flex: 1 }}>
      <MonthHeader>{date.format("YYYY年MM月")}</MonthHeader>
      <View style={{ flex: 1 }}>
        <FlatList
          data={calendar}
          renderItem={({ item }) => <DateRow date={item}></DateRow>}
        ></FlatList>
      </View>
    </View>
  );
}
