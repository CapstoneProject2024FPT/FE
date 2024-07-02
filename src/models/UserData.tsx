export interface UserData {
  username: string;
  password: string;
}

export enum RoleType {
  ADMIN = "Admin",
  USER = "User",
  SALE = "Sale",
  MANAGER = "Manager",
  TECHNICAL = "Technical",
}

export interface RegisterData extends UserData {
  email: string;
  fullname: string;
}

export type userPropUpdate = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
};
export interface userProps {
  id: string;
  fullName: string;
  email: string;
  image: string | null | undefined;
  phoneNumber: string;
  address: string;
  role: string;
  status: string;
  rank: { name: string; range: number };
}
export interface staffProps {
  fullName: string;
  email: string;
  photoURL: string | null | undefined;
  phoneNumber: string;
  address: string;
}
export interface staffModel extends staffProps {
  yearOfExperience: number;
}

export interface userModel extends userProps {
  amount: number;
}
