import axios from "axios";

const BarangayContact_API =
  "http://192.168.137.1/Disaster-backend/public/barangayContact.php";

export type brgyContactType = {
  id: number | string;
  barangay_name: string;
  contact_number: string;
  landline: string;
  email: string;
  faceebook_page: string;
  captain_name: string;
  secretary_name: string;
  lat: number | string;
  lng: number | string;
};

export async function getBarangayContact() {
  try {
    const response = await axios.get(BarangayContact_API);

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch Barangay contacts"
    );
  }
}
