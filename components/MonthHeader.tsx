import { Button, color } from "@rneui/base";
import { useTheme, Text } from "@rneui/themed";
import { FC } from "react";
import { View } from "react-native";

type MonthHeaderProps = {
  onMove: (offset: number) => void;
  children: string;
};

const MonthHeader: FC<MonthHeaderProps> = ({ onMove, children }) => {
  const { theme } = useTheme();
  function move(offset: number) {
    if (onMove) {
      onMove(offset);
    }
  }
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 50,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.grey4,
      }}
    >
      <Button
        onPress={() => move(-1)}
        icon={{
          name: "chevron-left",
          type: "font-awesome",
          color: theme.colors.primary,
        }}
        type="clear"
      ></Button>
      <Text style={{ fontSize: 30 }}>{children}</Text>
      <Button
        onPress={() => move(1)}
        icon={{
          name: "chevron-right",
          type: "font-awesome",
          color: theme.colors.primary,
        }}
        type="clear"
      ></Button>
    </View>
  );
};

export default MonthHeader;
