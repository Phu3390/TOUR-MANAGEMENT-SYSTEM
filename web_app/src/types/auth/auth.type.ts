export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  fullName: string
  email: string
  password: string
}

export interface AuthData {
  token: string
  authentication: boolean
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
}

export interface AuthResponse extends ApiResponse<AuthData> {}
