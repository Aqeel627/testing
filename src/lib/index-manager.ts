import http from "./axios-instance";
import { getData, saveData } from "./index-db";

export async function indexManager({
  url,
  payload,
  headers = {},
  expireIn = 300,
  forceApiCall = false,
  storeMap,
}: {
  url: string;
  payload: any;
  headers?: Record<string, string>;
  expireIn?: number;
  forceApiCall?: boolean;

  storeMap?: {
    storeAs: string;
    fromKey: string;
    setFn?: (value: any) => void;
    filterFn?: (data: any) => any; // ✅ NEW
  }[];
}) {
  let shouldFetch = forceApiCall;

  /* ---------------- CHECK CACHE ---------------- */
  if (storeMap && !forceApiCall) {
    let allFresh = true;

    for (const config of storeMap) {
      const { storeAs, setFn } = config;

      const cached = await getData(storeAs);

      if (cached) {
        const diff = (Date.now() - cached.timestamp) / 1000;

        if (diff < expireIn) {
          setFn?.(cached.data);
        } else {
          allFresh = false;
        }
      } else {
        allFresh = false;
      }
    }

    if (allFresh) return;

    shouldFetch = true;
  }

  /* ---------------- API CALL ---------------- */
  if (shouldFetch) {
    try {
      const response: any = await http.post(url, payload, { headers });

      const apiData = response?.data?.data ?? response?.data;

      if (storeMap) {
        for (const config of storeMap) {
          const { storeAs, fromKey, setFn, filterFn } = config;

          let dataToStore = apiData?.[fromKey];

          if (dataToStore === undefined) continue;

          // ✅ APPLY FILTER IF PROVIDED
          if (typeof filterFn === "function") {
            dataToStore = filterFn(dataToStore);
          }

          await saveData(storeAs, dataToStore);
          setFn?.(dataToStore);
        }
      }

      return apiData;
    } catch (error) {
      console.error("Dynamic Fetch Error:", error);
      throw error;
    }
  }
}