import type { CalendarDate } from "@/app";
import { FC } from "react";
import { View, Pressable } from "react-native";
import { Text, useTheme } from "@rneui/themed";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
type DateRowProps = {
  date: CalendarDate;
};
const DateRow: FC<DateRowProps> = ({ date }) => {
  const { theme } = useTheme();
  const day = dayjs(date.date).day();
  const router = useRouter();
  let color;
  switch (day) {
    case 0:
      color = "#522";
      break;
    case 6:
      color = "#225";
      break;
    default:
      color = theme.colors.background;
  }
  function moveTo(date: string) {
    router.push(`./date/${date}`);
  }
  return (
    <View
      style={{
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.grey3,
        backgroundColor: color,
      }}
    >
      <View
        style={{
          width: 30,
          height: "100%",
          borderRightWidth: 1,
          borderRightColor: theme.colors.grey3,
          justifyContent: "center",
        }}
      >
        <Text style={{ textAlign: "center" }}>{date.label}</Text>
      </View>
      <View
        style={{
          width: 30,
          height: "100%",
          borderRightWidth: 1,
          borderRightColor: theme.colors.grey3,
          justifyContent: "center",
        }}
      >
        <Text style={{ textAlign: "center" }}>{date.day}</Text>
      </View>
      <View style={{ flex: 1, justifyContent: "center", height: "100%" }}>
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            height: "100%",
            paddingLeft: 5,
          }}
          onPress={() => {
            moveTo(date.date);
          }}
        >
          <Text>{date.diary?.text}</Text>
        </Pressable>
      </View>
    </View>
  );
};
export default DateRow;
