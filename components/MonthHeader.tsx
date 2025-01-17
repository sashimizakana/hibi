import { Button, IconButton, Text } from "react-native-paper";
import { FC } from "react";
import { View } from "react-native";
import { useAppTheme } from "@/lib/theme";

type MonthHeaderProps = {
  children: string;
};

const MonthHeader: FC<MonthHeaderProps> = ({ children }) => {
  const theme = useAppTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.border,
      }}
    >
      <Text style={{ fontSize: 30 }}>{children}</Text>
    </View>
  );
};

export default MonthHeader;
