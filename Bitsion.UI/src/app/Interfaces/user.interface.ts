export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

// DTOs

export interface UserRegisterRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  createdAt: Date;
  accessToken?: string;
  refreshToken?: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

// Interfaz para el state management

export interface UserState {
  loading: boolean;
  error: string | null;
  user: User | null;
}
