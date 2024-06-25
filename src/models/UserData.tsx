export interface UserData {
  username: string;
  password: string;
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
  photoURL: string | null | undefined;
  phoneNumber: string;
  address: string;
  role: string;
  status: string;
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

export interface userModel extends Omit<userProps, "photoURL"> {}
