import _ from "lodash";
import { useState, FC, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import { DiariesAtomFamily } from "@/atoms/diary";
import { useAppTheme } from "@/lib/theme";
import { Text, TextInput } from "react-native-paper";
import useDebounce from "react-use/lib/useDebounce";
import Todos from "@/components/Todos";
import Tasks from "@/components/Tasks";
import Marks from "@/components/Marks";
import { HolidaysAtomFamily } from "@/atoms/holiday";

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
  const date = params.date as string;
  const { colors } = useAppTheme();
  const [text, setText] = useState<string>();
  const [loadedDate, setLoadedDate] = useState<string>();
  const [diary, saveDiary] = useAtom(DiariesAtomFamily(date));
  const holiday = useAtomValue(HolidaysAtomFamily(date));
  useDebounce(
    () => {
      saveDiary({ text });
    },
    300,
    [text]
  );
  async function onChangeText(text: string) {
    setText(text);
  }
  useEffect(() => {
    if (loadedDate === diary?.date) {
      return;
    }
    setLoadedDate(diary?.date);
    onChangeText(diary?.text || "");
  }, [diary]);
  return (
    <ScrollView style={{ flex: 1 }}>
      {holiday && (
        <View style={{ paddingLeft: 15 }}>
          <Text style={{ color: colors.error }}>{holiday.name}</Text>
        </View>
      )}
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
        <Marks date={date}></Marks>
      </View>
      <View>
        <SectionHeader>TODO</SectionHeader>
        <Todos date={date}></Todos>
      </View>
      <View>
        <SectionHeader>タスク</SectionHeader>
        <Tasks date={date}></Tasks>
      </View>
    </ScrollView>
  );
};
const styles = {
  input: {
    margin: 12,
  },
};
export default DateDetail;
