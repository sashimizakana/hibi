import { Input, Text, useTheme } from "@rneui/themed";
import { useState, FC, useEffect } from "react";
import { View } from "react-native";
import MarkSelector from "@/components/MarkSelector";
import { useGlobalSearchParams } from "expo-router";
import { DayDiaryAtom, DiaryAtom } from "@/atoms/diary";
import { useAtom } from "jotai";

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
  const [dayDiary, setDayDiary] = useAtom(DayDiaryAtom);
  const [diary, setDiary] = useAtom(DiaryAtom);
  const [text, setText] = useState(diary?.text ?? "");
  const [marks, setMarks] = useState<string[]>([]);
  function toggleMark(color: string) {
    setMarks((prev) => {
      if (prev.includes(color)) {
        return prev.filter((c) => c !== color);
      } else {
        return [...prev, color];
      }
    });
  }
  const params = useGlobalSearchParams();
  function onChangeText(value: string) {
    setDiary({
      date: params.date as string,
      text: value,
      marks: null,
      tasks: null,
    });
    setText(value);
  }
  useEffect(() => {
    setDayDiary(params.date as string);
  }, [params.date]);
  useEffect(() => {
    setText(diary?.text ?? "");
  }, [diary]);
  console.log("state", diary, text);
  return (
    <View style={{ flex: 1 }}>
      <View>
        <Input
          onChangeText={onChangeText}
          value={text}
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
            isActive={marks.includes(color)}
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
