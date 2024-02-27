interface BasicUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly gender: 'male' | 'female' | 'rather_not_say';
  readonly created_at: string;
  readonly updated_at: string | null;
}

export interface AdditionalDetail {
  readonly phone: string | null;
  readonly age: number | null;
  readonly blood_group:
    | 'A+'
    | 'A-'
    | 'AB+'
    | 'AB-'
    | 'B+'
    | 'B-'
    | 'O+'
    | 'O-'
    | 'Unknown';
}

export interface AdminProps extends BasicUser {
  accessToken: string;
  authenticated: boolean;
  readonly additional_details: null;
  readonly user_role: 'admin';
}

interface CustomerProps extends BasicUser {
  readonly additional_details: AdditionalDetail;
}

export interface CaretakerProps extends CustomerProps {
  readonly user_role: 'caretaker';
  readonly patients: PatientProps[];
}
export interface DoctorProps extends CustomerProps {
  readonly user_role: 'doctor';
  readonly patients: PatientProps[];
}
export interface PatientProps extends CustomerProps {
  readonly user_role: 'patient';
  readonly caretakers: CaretakerProps[];
  readonly doctors: DoctorProps[];
}

export // API
type ApiResponse = {
  total: number;
  page: number;
  size: number;
  pages: number;
  items: [];
};

// Pagination
export type HasPages = {
  has_next: boolean;
  has_prev: boolean;
};
