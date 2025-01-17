import { useCallback, useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import dayjs from "dayjs";
import { useAtom, useSetAtom } from "jotai";
import { DiaryMonthAtom, MonthDiariesAtom } from "@/atoms/diary";
import { useFocusEffect } from "expo-router";
import Calendar from "@/components/Calendar";
import PagerView from "react-native-pager-view";

const PAGES = 2;
export default function Index() {
  const [ym, setYm] = useState(dayjs().startOf("month").format("YYYY-MM"));
  const refreshDiaries = useSetAtom(MonthDiariesAtom);
  const setDiaryMonth = useSetAtom(DiaryMonthAtom);
  useEffect(() => {
    setDiaryMonth(ym);
  }, [ym]);
  useFocusEffect(
    useCallback(() => {
      refreshDiaries();
    }, [])
  );
  const center = dayjs(ym + "-01").startOf("month");
  const pages: string[] = [];
  for (let i = 0; i < PAGES; i++) {
    pages.push(center.subtract(PAGES - i, "month").format("YYYY-MM"));
  }
  pages.push(center.format("YYYY-MM"));
  for (let i = 0; i < PAGES; i++) {
    pages.push(center.add(i + 1, "month").format("YYYY-MM"));
  }
  function changePage(e: any) {
    setYm(pages[e.nativeEvent.position]);
  }
  return (
    <View style={{ flex: 1 }}>
      <PagerView
        style={{ flex: 1 }}
        initialPage={2}
        onPageSelected={changePage}
      >
        {pages.map((ym, i) => (
          <Calendar
            ym={ym}
            key={ym}
            active={Math.floor(pages.length / 2) === i}
          ></Calendar>
        ))}
      </PagerView>
    </View>
  );
}
