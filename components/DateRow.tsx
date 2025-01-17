import type { CalendarDate } from "@/components/Calendar";
import { FC } from "react";
import { View, Pressable } from "react-native";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { Text } from "react-native-paper";
import { useAppTheme } from "@/lib/theme";
type DateRowProps = {
  date: CalendarDate;
  diary: any;
};
const DateRow: FC<DateRowProps> = ({ date, diary }) => {
  const day = dayjs(date.date).day();
  const theme = useAppTheme();
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
    router.push(`/date/${date}`);
  }
  return (
    <View
      style={{
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: color,
      }}
    >
      <View
        style={{
          width: 30,
          height: "100%",
          borderRightWidth: 1,
          borderRightColor: theme.colors.border,
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
          borderRightColor: theme.colors.border,
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
            position: "relative",
          }}
          onPress={() => {
            moveTo(date.date);
          }}
        >
          <View
            style={{
              position: "absolute",
              left: 2,
              top: 2,
              flexDirection: "row",
              gap: 1,
            }}
          >
            {diary?.marks?.map((mark: string) => (
              <View
                key={mark}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: mark,
                }}
              ></View>
            ))}
          </View>
          <Text>{diary?.text}</Text>
        </Pressable>
      </View>
    </View>
  );
};
export default DateRow;
