import { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import dayjs from "dayjs";
import MonthHeader from "@/components/MonthHeader";
import DateRow from "@/components/DateRow";

type CalendarProps = {
  ym: string;
};

export default function Calendar({ ym }: CalendarProps) {
  const date = dayjs(ym + "-01");
  const [calendar, setCalendar] = useState<string[]>([]);
  useEffect(() => {
    const calendar = [];
    let cursor = dayjs(dayjs(ym + "-01").startOf("month"));
    while (cursor.format("YYYY-MM") === ym) {
      calendar.push(cursor.format("YYYY-MM-DD"));
      cursor = cursor.add(1, "day");
    }
    setCalendar(calendar);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <MonthHeader>{date.format("YYYY年MM月")}</MonthHeader>
      <ScrollView style={{ flex: 1 }}>
        {calendar.map((v) => (
          <DateRow date={v} key={v}></DateRow>
        ))}
      </ScrollView>
    </View>
  );
}
