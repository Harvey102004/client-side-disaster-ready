// EVACUATION CENTER TYPES

export interface EvacuationCenterProps {
  id?: string | number;
  name: string;
  capacity: number;
  location: string;
  current_evacuees?: number;
  contact_person: string;
  contact_number: string;
  lat: number | null;
  long: number | null;
  created_by?: string;
  chartStyle?: string;
}

export interface GetEvacuationProps {
  id?: string;
  name: string;
  location: string;
  capacity: string | number;
  current_evacuees: string | number;
  contact_person: string;
  contact_number: string;
  lat?: string | number;
  long?: string | number;
  created_by?: string;
}

export interface GetEvacCard {
  id?: string;
  name: string;
  location: string;
  capacity: string | number;
  current_evacuees: string | number;
  onclick: () => void;
}

export interface GetEvacDetails {
  id: string;
  name: string;
  location: string;
  contact_person: number | string;
  contact_number: number | string;
  capacity: string | number;
  current_evacuees: string | number;
  lat?: string | number;
  long?: string | number;
  onclick: () => void;
}
