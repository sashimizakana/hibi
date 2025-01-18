import _ from "lodash";
import { useState, FC, useEffect, Suspense, useCallback, useRef } from "react";
import { View } from "react-native";
import MarkSelector from "@/components/MarkSelector";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { DayDiaryAtom, DiaryAtom } from "@/atoms/diary";
import { useAppTheme } from "@/lib/theme";
import { Text, TextInput } from "react-native-paper";

const markColors = ["#26547C", "#EF476F", "#FFD166", "#06D6A0", "#FCFCFC"];

interface SectionHeaderProps {
  children: string;
}

const SectionHeader: FC<SectionHeaderProps> = ({ children }) => {
  const theme = useAppTheme();
  return (
    <Text
      variant="headlineMedium"
      style={{ marginTop: 30, paddingLeft: 10, color: theme.colors.secondary }}
    >
      {children}
    </Text>
  );
};

const DateDetail = () => {
  const params = useGlobalSearchParams();
  const { colors } = useAppTheme();
  const [text, setText] = useState<string>();
  const [marks, setMarks] = useState<string[]>([]);
  const setDate = useSetAtom(DayDiaryAtom);
  const [diary, setDiary] = useAtom(DiaryAtom);
  const editing = useRef<any>();
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      saveDiary();
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    editing.current = {
      date: params.date as string,
      text,
      marks,
    };
  }, [text, marks]);
  async function saveDiary() {
    await setDiary(editing.current);
  }
  useEffect(() => {
    setDate(params.date as string);
    return () => setDate("");
  }, [params.date]);
  useEffect(() => {
    if (diary) {
      setText(diary.text || "");
      setMarks(diary.marks || []);
    }
  }, [diary]);
  function toggleMark(color: string) {
    let newMarks = [...marks];
    if (newMarks.includes(color)) {
      newMarks = newMarks.filter((c: any) => c !== color);
    } else {
      newMarks.push(color);
    }
    setMarks(newMarks);
  }
  function onChangeText(text: string) {
    setText(text);
  }
  return (
    <View style={{ flex: 1 }}>
      <View>
        <TextInput
          onChangeText={onChangeText}
          value={text}
          placeholder="どんな日？"
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
            },
          ]}
          underlineColor={colors.border}
          outlineColor="transparent"
          activeOutlineColor="transparent"
          multiline={true}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        {markColors.map((color) => (
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
    margin: 12,
  },
};
export default DateDetail;
