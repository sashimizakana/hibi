import { useEffect, useState } from "react";
import { View } from "react-native";
import dayjs from "dayjs";
import { useSetAtom } from "jotai";
import { fetchMonthDiariesAtom } from "@/atoms/diary";
import Calendar from "@/components/Calendar";
import PagerView from "react-native-pager-view";
import { Message } from "@/components/Message";

const PAGES = 2;
export default function Index() {
  const [ym, setYm] = useState(dayjs().startOf("month").format("YYYY-MM"));
  const [scrolling, setScrolling] = useState(false);
  const fetchMonthDiaries = useSetAtom(fetchMonthDiariesAtom);
  useEffect(() => {
    fetchMonthDiaries(ym);
  }, [ym]);
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
          <Calendar ym={ym} key={ym} scrolling={scrolling}></Calendar>
        ))}
      </PagerView>
      <Message></Message>
    </View>
  );
}
