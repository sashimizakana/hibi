import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
export const db = openDatabaseSync("main.db");
export default drizzle(db);
