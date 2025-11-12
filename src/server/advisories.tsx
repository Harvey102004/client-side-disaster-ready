import axios from "axios";

import {
  TWeatherAdvisory,
  TRoadAdvisory,
  TDisasterAdvisory,
  TCommunity,
} from ".../../../types";

// FETCH ADVISORIES

const API_URL_WEATHER =
  "http://localhost:3001/public/fetchWeatherAdvisoriesClient.php";

const API_URL_ROAD =
  "http://localhost:3001/public/fetchRoadAdvisoriesClient.php";

const API_URL_DISASTER =
  "http://localhost:3001/public/fetchDisasterUpdateClient.php";

const API_URL_COMMUNITY =
  "http://localhost:3001/public/fetchCommunityNoticeClient.php";

export const getWeather = async (): Promise<TWeatherAdvisory[]> => {
  try {
    const response = await axios.get<TWeatherAdvisory[]>(API_URL_WEATHER);
    if (Array.isArray(response.data)) {
      return response.data;
    }

    console.log(response.data);

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getRoad = async (): Promise<TRoadAdvisory[]> => {
  try {
    const response = await axios.get<TRoadAdvisory[]>(API_URL_ROAD);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getDisaster = async (): Promise<TDisasterAdvisory[]> => {
  try {
    const response = await axios.get<TDisasterAdvisory[]>(API_URL_DISASTER);
    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getCommunity = async (): Promise<TCommunity[]> => {
  try {
    const response = await axios.get<TCommunity[]>(API_URL_COMMUNITY);

    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// GET DETAILS OF SPECIFIC ADVISORY

export const getWeatherDetails = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get<TWeatherAdvisory[]>(
      `http://localhost:3001/public/fetchWeatherAdvisoriesClient.php?id=${id}`
    );
    return response.data[0] || null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getRoadDetails = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get<TRoadAdvisory[]>(
      `http://localhost:3001/public/fetchRoadAdvisoriesClient.php?id=${id}`
    );

    return response.data[0] || null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getDisasterDetails = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get<TDisasterAdvisory[]>(
      `http://localhost:3001/public/fetchDisasterUpdateClient.php?id=${id}`
    );

    return response.data[0] || null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getCommunityDetails = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get<TWeatherAdvisory[]>(
      `http://localhost:3001/public/fetchCommunityNoticeClient.php?id=${id}`
    );

    return response.data[0] || null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
