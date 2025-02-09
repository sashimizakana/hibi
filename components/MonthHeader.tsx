import { Button, IconButton, Text } from "react-native-paper";
import { FC, useState } from "react";
import { View } from "react-native";
import { useAppTheme } from "@/lib/theme";
import Menu from "@/components/Menu";

type MonthHeaderProps = {
  children: string;
};

const MonthHeader: FC<MonthHeaderProps> = ({ children }) => {
  const theme = useAppTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  function openMenu() {
    setMenuVisible(true);
  }
  function onRequestClose() {
    setMenuVisible(false);
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
      <View></View>
      <Text style={{ fontSize: 30 }}>{children}</Text>
      <View>
        <IconButton
          icon="menu"
          size={20}
          iconColor={theme.colors.primary}
          onPress={openMenu}
        ></IconButton>
        <Menu visible={menuVisible} onRequestClose={onRequestClose}></Menu>
      </View>
    </View>
  );
};

export default MonthHeader;
