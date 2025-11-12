import axios from "axios";

import { EvacuationCenterProps } from "../../types";

// -------- FETCH ALL EVACUATION CENTER ---------- //

const API_GET_EVACUATIONS =
  "http://localhost:3001/public/fetchEvacuationCenterClient.php ";

interface FetchEvacuationResponse {
  success: boolean;
  data: EvacuationCenterProps[];
}
export const getEvacuationCenters = async (): Promise<
  EvacuationCenterProps[]
> => {
  try {
    const response = await axios.get(API_GET_EVACUATIONS);

    if (Array.isArray(response.data)) {
      return response.data;
    }

    console.warn("Unexpected response structure:", response.data);
    return [];
  } catch (error) {
    console.error("Evac fetch error:", error);
    return [];
  }
};

// -------- GET EVACUATION CENTER DETAILS ---------- /

export const getEvacuationDetails = async ({
  id,
}: {
  id: string;
}): Promise<EvacuationCenterProps | null> => {
  try {
    const response = await axios.get(
      `http://localhost:3001/public/evacuationCenterClient.php?id=${id}`
    );

    const data = response.data?.data ?? response.data ?? null;

    if (!data || typeof data !== "object") {
      console.warn("Invalid evac details structure:", response.data);
      return null;
    }

    return data;
  } catch (error: any) {
    console.error("Evac details error:", error);
    return null;
  }
};
