import _ from "lodash";
import dayjs from "dayjs";
import { FC } from "react";
import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "react-native-paper";
import { useAppTheme } from "@/lib/theme";
import { DiariesAtomFamily } from "@/atoms/diary";
import { useAtomValue } from "jotai";

type DateRowProps = {
  date: string;
  scrolling: boolean;
};

const DateRow: FC<DateRowProps> = ({ date, scrolling }) => {
  const diary = useAtomValue(DiariesAtomFamily(date));
  const dateObj = dayjs(date);
  const dateNumber = dateObj.date();
  const dayNumber = dateObj.day();
  const day = dateObj.format("ddd");
  const theme = useAppTheme();
  const router = useRouter();
  let color;
  switch (dayNumber) {
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
  const text = diary?.text || "";
  const marks = diary?.marks || [];
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
        <Text style={{ textAlign: "center" }}>{dateNumber}</Text>
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
        <Text style={{ textAlign: "center" }}>{day}</Text>
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
            if (scrolling) {
              return;
            }
            moveTo(date);
          }}
          disabled={scrolling}
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
            {marks.map((mark: string) => (
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
          <Text numberOfLines={1} ellipsizeMode="tail">
            {text}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
export default DateRow;
