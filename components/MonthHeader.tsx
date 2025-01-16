import { Button, IconButton, Text } from "react-native-paper";
import { FC } from "react";
import { View } from "react-native";
import { useAppTheme } from "@/lib/theme";

type MonthHeaderProps = {
  onMove: (offset: number) => void;
  children: string;
};

const MonthHeader: FC<MonthHeaderProps> = ({ onMove, children }) => {
  const theme = useAppTheme();
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
        borderBottomColor: theme.colors.border,
      }}
    >
      <IconButton
        onPress={() => move(-1)}
        icon="chevron-left"
        iconColor={theme.colors.primary}
      ></IconButton>
      <Text style={{ fontSize: 30 }}>{children}</Text>
      <IconButton
        onPress={() => move(1)}
        icon="chevron-right"
        iconColor={theme.colors.primary}
      ></IconButton>
    </View>
  );
};

export default MonthHeader;
