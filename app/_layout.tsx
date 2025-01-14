import { createTheme, ThemeProvider, useTheme, Text } from "@rneui/themed";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { useEffect } from "react";
import expoDB, { db } from "@/db/db";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/db/migrations/migrations";

dayjs.locale("ja");

function Index() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.background,
      }}
    >
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitleStyle: {
            color: theme.colors.black,
          },
          headerTintColor: theme.colors.primary,
          navigationBarColor: theme.colors.background,
          contentStyle: {
            backgroundColor: theme.colors.background,
            flex: 1,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="date/[date]"
          options={({ route }) => ({
            title: route.params
              ? dayjs((route.params as any).date).format("YYYY年MM月DD日(ddd)")
              : "", // ページタイトルを変更
          })}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  useDrizzleStudio(db);
  const myTheme = createTheme({ mode: "dark" });
  //初回表示時に本日の詳細ページを開く
  const router = useRouter();
  const params = useGlobalSearchParams();
  const { success, error } = useMigrations(expoDB, migrations);
  useEffect(() => {
    if (!params.date && success) {
      router.push(`./date/${dayjs().format("YYYY-MM-DD")}`);
    }
  }, [success]);

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: myTheme.darkColors?.background,
        }}
      >
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: myTheme.darkColors?.background,
        }}
      >
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider theme={myTheme}>
      <Index></Index>
    </ThemeProvider>
  );
}
