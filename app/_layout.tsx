import { PaperProvider, Text } from "react-native-paper";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { useEffect } from "react";
import expoDB, { db } from "@/db/db";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/db/migrations/migrations";
import { useAppTheme } from "@/lib/theme";
import { fetchTasksAtom } from "@/atoms/task";
import { useSetAtom } from "jotai";
import { fetchConfigAtom } from "@/atoms/config";

dayjs.locale("ja");

function Index() {
  const theme = useAppTheme();
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
            color: theme.colors.text,
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
  const router = useRouter();
  const params = useGlobalSearchParams();
  const fetchTasks = useSetAtom(fetchTasksAtom);
  const fetchConfig = useSetAtom(fetchConfigAtom);
  const { success, error } = useMigrations(expoDB, migrations);
  async function initialize() {
    await fetchConfig();
    await fetchTasks();
    if (!params.date) {
      //初回表示時に本日の詳細ページを開く
      router.push(`./date/${dayjs().format("YYYY-MM-DD")}`);
    }
  }
  useEffect(() => {
    if (success) {
      initialize();
    }
  }, [success]);
  const theme = useAppTheme();

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
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
          backgroundColor: theme.colors.background,
        }}
      >
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <Index></Index>
    </PaperProvider>
  );
}
