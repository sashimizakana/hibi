import _ from "lodash";
import { useState, FC, useEffect, Suspense, useCallback, useRef } from "react";
import { View } from "react-native";
import MarkSelector from "@/components/Marks/MarkSelector";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { DayDiaryAtom, DayTextAtom, DiaryAtom } from "@/atoms/diary";
import { useAppTheme } from "@/lib/theme";
import { Text, TextInput } from "react-native-paper";
import Todos from "@/components/Todos";
import Tasks from "@/components/Tasks";
import Marks from "@/components/Marks";
import { fetchTodosAtom } from "@/atoms/todo";

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
  const { colors } = useAppTheme();
  const [text, setText] = useState<string>();
  const saveDiary = useSetAtom(DiaryAtom);
  const dayText = useAtomValue(DayTextAtom);
  const editing = useRef<any>();
  async function save() {
    await saveDiary(editing.current);
  }
  useEffect(() => {
    setText(dayText || "");
  }, [dayText]);
  function onChangeText(text: string) {
    setText(text);
  }
  return (
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
  );
};
const styles = {
  input: {
    margin: 12,
  },
};
export default DateDetail;
