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
    filterFn?: (data: any) => any;
  }[];
}) {
  let shouldFetch = forceApiCall;

  /* ---------------- CHECK CACHE ---------------- */
  if (storeMap && !forceApiCall) {
    let anyExpired = false;

    for (const config of storeMap) {
      const { storeAs, setFn } = config;

      const cached = await getData(storeAs);

      if (cached) {
        const diff = (Date.now() - cached.timestamp) / 1000;

        // ✅ Always show cached data immediately
        setFn?.(cached.data);

        // Check expiry
        if (diff >= expireIn) {
          anyExpired = true;
        }
      } else {
        anyExpired = true;
      }
    }

    // If nothing expired → no need to call API
    if (!anyExpired) return;

    // If expired → fetch in background
    shouldFetch = true;
  }

  /* ---------------- API CALL (BACKGROUND SAFE) ---------------- */
  if (shouldFetch) {
    try {
      const response: any = await http.post(url, payload, { headers });

      const apiData = response?.data?.data ?? response?.data;

      if (storeMap) {
        for (const config of storeMap) {
          const { storeAs, fromKey, setFn, filterFn } = config;

          let dataToStore = apiData?.[fromKey];
          if (dataToStore === undefined) continue;

          if (typeof filterFn === "function") {
            dataToStore = await filterFn(dataToStore);
          }

          await saveData(storeAs, dataToStore);

          // ✅ Update UI with fresh data
          setFn?.(dataToStore);
        }
      }

      return apiData;
    } catch (error) {
      console.error("Dynamic Fetch Error:", error);
    }
  }
}