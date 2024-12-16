export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData extends LoginFormData {
  name: string;
  confirmPassword: string;
}

export interface AuthError {
  message: string;
  field?: string;
}

export interface FormInputProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  endAdornment?: React.ReactNode;
  className?: string;
}

export interface ValidationMessageProps {
  message: string;
  type: 'error' | 'success';
}
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  last_login: string;
}

export interface TokenPayload {
  exp: number;
}