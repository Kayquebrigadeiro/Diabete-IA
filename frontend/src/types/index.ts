export type UUID = string;

export interface User {
  id: UUID;
  name: string;
  email: string;
  phone?: string | null;
}

export interface Child {
  id: UUID;
  user_id: UUID;
  name: string;
  birth_date: string;
  weight_kg?: number | null;
  diagnosis_date?: string | null;
}

export interface Medication {
  id: UUID;
  name: string;
  manufacturer?: string | null;
  type: string;
  description?: string | null;
}

export interface MedicationSchedule {
  id: UUID;
  child_id: UUID;
  medication_id: UUID;
  dose_amount: number;
  scheduled_time: string;
  relation_carbs?: number | null;
  sensitivity_factor?: number | null;
  notes?: string | null;
}

export interface Notification {
  id: UUID;
  user_id: UUID;
  child_id?: UUID | null;
  type: string;
  title: string;
  message: string;
  scheduled_at: string;
  sent_at?: string | null;
  status: string;
}

export interface GlucoseRecord {
  id: UUID;
  child_id: UUID;
  glucose_value: number;
  measurement_type: string;
  carbs_grams?: number | null;
  bolus_correction?: number | null;
  bolus_food?: number | null;
  activity_intensity?: string | null;
  notes?: string | null;
  recorded_at: string;
}

export interface ChatCitation {
  document: string;
  chunk_index: number;
  excerpt?: string | null;
}

export interface ChatAnswer {
  answer: string;
  confidence_score: number;
  confidence_label: string;
  citations: ChatCitation[];
  fallback: boolean;
}

