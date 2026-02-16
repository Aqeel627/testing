import { openDB } from "idb";
import { CONFIG } from "./config";

const dbName = CONFIG.SiteName;
const storeName = CONFIG.SiteName;

export const initDB = async () => {
  return openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    },
  });
};

export const saveData = async (key: string, data: any) => {
  const db = await initDB();

  const payload = {
    data,
    timestamp: Date.now(), // ⬅ added
  };

  return db.put(storeName, payload, key);
};

export const getData = async (key: string) => {
  const db = await initDB();
  return db.get(storeName, key); // returns { data, timestamp }
};
