export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  country_id: string;
  accept: boolean;

}

export interface SimplifiedCountry {
  id: string;
  name_en: string;
}

export interface SimplifiedRegisterResponseData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  access_token: string;
  country: SimplifiedCountry;
}

export interface RegisterResponse {
  data: SimplifiedRegisterResponseData;
  message?: string;
  success?: boolean;
}

// Error response interface
export interface ErrorResponse {
  message: string;
  errors?: { [key: string]: string[] };
  status?: number;
}



export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
   id: string;
  first_name: string;
  last_name: string;
  email: string;
  access_token: string;
}



export interface ForgetPasswordRequest {
  email: string;
}


export interface forgetPasswordresponse {
  message: string;
}


export interface OtpVerificationRequest {
  email: any;
  code: string;
}

export interface OtpVerificationResponse {
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  code: string;
}

export interface ResetPasswordResponse {
  message: string;
}


export interface ChangeRequest {
  code: string;
  email: string;
  newPassword: string;
}

export interface ChangeResponse{
  message:string;
}
