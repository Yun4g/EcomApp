
export interface User {
  id: string;       
  name: string;
  email: string;
  password: string;
  created_at: string;
}

export interface JwtPayload {
  userId: string;
}


export interface signUpServiceType {
    name: string;
    email: string;
    password: string;
}

export interface LoginServiceType {
    email: string;
    password: string;
}
