
export interface User {
  name: string;
  sort: number;
  id: string;
  email: string;
  Date: string;
  img: string;
  status: string;
  Groups: string;
  'License Name': string;
  role: string;
  selected: boolean;
}

export interface UserProfile extends User {
  bio?: string;
  phoneNumber?: string;
  address?: string;
}
