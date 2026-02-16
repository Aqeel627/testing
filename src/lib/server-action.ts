import { http } from "./axios-instance";


export async function getServerSideData(url: string, payload?: any) {
  "use server";
  try {
    const response = await http.post(url, payload);
    return response?.data?.data;
  } catch (err: any) {
    console.error("API Error:", err?.message || err);
    return null;
  }
}