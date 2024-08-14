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

export interface userPropUpdate {
  fullName: string;
  email: string;
  phoneNumber: string;
  image: string | undefined;
  gender: string | undefined;
}

export interface staffUpdateProps extends userPropUpdate {
  yearsOfExperience: number;
}

export interface userProps {
  id: string;
  fullName: string;
  email: string;
  image: string | undefined;
  phoneNumber: string;
  address: string;
  role: string;
  status: string;
  rank: { name: string; range: number };
  gender: string;
}
export interface staffProps extends Omit<userProps, "rank"> {
  yearsOfExperience: number;
}

export interface userModel extends userProps {
  point: number;
}
