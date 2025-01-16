import _ from "lodash";
import { Input, Text, useTheme } from "@rneui/themed";
import { useState, FC, useEffect, Suspense, useCallback } from "react";
import { TextInput, View } from "react-native";
import MarkSelector from "@/components/MarkSelector";
import { useGlobalSearchParams } from "expo-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { DayDiaryAtom, DiaryAtom } from "@/atoms/diary";

const colors = ["#26547C", "#EF476F", "#FFD166", "#06D6A0", "#FCFCFC"];

interface SectionHeaderProps {
  children: string;
}

const SectionHeader: FC<SectionHeaderProps> = ({ children }) => {
  const { theme } = useTheme();
  return (
    <Text
      h4
      style={{ marginTop: 30, paddingLeft: 10, color: theme.colors.grey2 }}
    >
      {children}
    </Text>
  );
};

const DateDetail = () => {
  const params = useGlobalSearchParams();
  const [editing, setEditing] = useState<any>({
    date: params.date as string,
    text: "",
    marks: [],
  });
  const setDate = useSetAtom(DayDiaryAtom);
  const [diary, setDiary] = useAtom(DiaryAtom);
  async function saveDiary(diary: any) {
    const saved = await setDiary(diary);
    setEditing(saved);
  }
  const save = useCallback(_.debounce(saveDiary, 300), []);
  useEffect(() => {
    setDate(params.date as string);
  }, [params.date]);
  useEffect(() => {
    if (diary) {
      setEditing(diary);
    }
    return () => setDate("");
  }, [diary]);
  function toggleMark(color: string) {
    let marks = editing.marks || [];
    if (marks.includes(color)) {
      marks = marks.filter((c: any) => c !== color);
    } else {
      marks.push(color);
    }
    setEditing({ ...editing, marks });
    save({ ...editing, marks });
  }
  function onChangeText(text: string) {
    setEditing({ ...editing, text });
    save({ ...editing, text });
  }
  return (
    <Suspense fallback={<View></View>}>
      <View style={{ flex: 1 }}>
        <View>
          <Input
            onChangeText={onChangeText}
            value={editing.text}
            placeholder="どんな日？"
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {colors.map((color) => (
            <MarkSelector
              key={color}
              color={color}
              isActive={editing.marks?.includes(color)}
              onToggle={() => toggleMark(color)}
            ></MarkSelector>
          ))}
        </View>
        <View>
          <SectionHeader>TODO</SectionHeader>
        </View>
        <View>
          <SectionHeader>タスク</SectionHeader>
        </View>
      </View>
    </Suspense>
  );
};
const styles = {
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
};
export default DateDetail;
