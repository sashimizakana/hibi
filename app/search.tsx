import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import db from "@/db/db";
import { diaries } from "@/db/schema";
import { desc, eq, like, not } from "drizzle-orm";
import { TextInput, Text } from "react-native-paper";
import { useAppTheme } from "@/lib/theme";
import dayjs from "dayjs";
type Diary = typeof diaries.$inferSelect;

const SearchPage: React.FC = () => {
  const { colors } = useAppTheme();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems(next: boolean = false) {
    setLoading(true);
    try {
      const data = await db
        .select()
        .from(diaries)
        .where(
          search ? like(diaries.text, `%${search}%`) : not(eq(diaries.text, ""))
        )
        .orderBy(desc(diaries.date))
        .limit(10)
        .offset(next ? items.length : 0);
      setItems((prev) => (next ? [...prev, ...data] : data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    if (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20 &&
      !loading
    ) {
      console.log("load start");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={() => fetchItems()}
        returnKeyType="search"
      />
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        {items.map((item) => (
          <View
            key={item.date}
            style={[styles.item, { borderColor: colors.border }]}
          >
            <Text style={{ color: colors.secondary }}>
              {dayjs(item.date).format("YYYY年MM月DD日(ddd)")}
            </Text>
            <Text>{item.text}</Text>
          </View>
        ))}
        {loading && <ActivityIndicator size="large" color={colors.primary} />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    borderWidth: 1,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
  },
});

export default SearchPage;
