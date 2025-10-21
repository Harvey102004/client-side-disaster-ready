import axios from "axios";

import { EvacuationCenterProps } from "../../types";

// -------- FETCH ALL EVACUATION CENTER ---------- //

const API_GET_EVACUATIONS =
  "http://192.168.137.1/Disaster-backend/controllers/evacuationCenterController.php";

export const getEvacuationCenters = async (): Promise<
  EvacuationCenterProps[]
> => {
  try {
    const response =
      await axios.get<EvacuationCenterProps[]>(API_GET_EVACUATIONS);

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch Evacuation center"
    );
  }
};

// -------- GET EVACUATION CENTER DETAILS ---------- /

export const getEvacuationDetails = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get<EvacuationCenterProps>(
      `http://192.168.137.1/Disaster-backend/controllers/evacuationCenterController.php?&id=${id}`
    );

    console.log(response.data);

    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch Evacuation center"
    );
  }
};
