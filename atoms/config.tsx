import db from "@/db/db";
import _ from "lodash";
import { configs } from "@/db/schema";
import { atom } from "jotai";

export const ConfigAtom = atom<any>({});
export const fetchConfigAtom = atom(null, async (get, set) => {
  const data = await db.select().from(configs);
  set(ConfigAtom, {
    ...get(ConfigAtom),
    ...Object.fromEntries(data.map((d) => [d.name, d.data])),
  });
  return data;
});
export const saveConfigAtom = atom(
  null,
  async (get, set, name: string, data: any) => {
    const [config] = await db
      .insert(configs)
      .values({
        name,
        data,
      })
      .onConflictDoUpdate({
        target: configs.name,
        set: { data },
      })
      .returning();
    set(ConfigAtom, {
      ...get(ConfigAtom),
      [config.name]: config.data,
    });
    return config;
  }
);
