import { useEffect, useState } from "react";
import { View } from "react-native";
import dayjs from "dayjs";
import { useSetAtom } from "jotai";
import { fetchMonthDiariesAtom } from "@/atoms/diary";
import Calendar from "@/components/Calendar";
import PagerView from "react-native-pager-view";
import { fetchHolidaysAtom, loadHolidaysAtom } from "@/atoms/holiday";
import { scrollingAtom } from "@/atoms/scrolling";

const PAGES = 2;
export default function Index() {
  const [ym, setYm] = useState(dayjs().startOf("month").format("YYYY-MM"));
  const setScrolling = useSetAtom(scrollingAtom);
  const fetchMonthDiaries = useSetAtom(fetchMonthDiariesAtom);
  const fetchHolidays = useSetAtom(fetchHolidaysAtom);
  const loadHolidays = useSetAtom(loadHolidaysAtom);

  async function loadMonth(value: string) {
    fetchMonthDiaries(value);
    await loadHolidays(value.split("-")[0]);
    fetchHolidays(value);
  }
  useEffect(() => {
    loadMonth(ym);
  }, []);
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
    const value = pages[e.nativeEvent.position];
    console.log("changePage", e.nativeEvent.position, value);
    loadMonth(value);
    setYm(value);
  }
  function changeState(e: any) {
    if (e.nativeEvent.pageScrollState === "dragging") {
      setScrolling(true);
    } else if (e.nativeEvent.pageScrollState === "idle") {
      setTimeout(() => setScrolling(false), 300);
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <PagerView
        style={{ flex: 1 }}
        initialPage={2}
        onPageSelected={changePage}
        onPageScrollStateChanged={changeState}
      >
        {pages.map((ym) => (
          <Calendar ym={ym} key={ym}></Calendar>
        ))}
      </PagerView>
    </View>
  );
}
