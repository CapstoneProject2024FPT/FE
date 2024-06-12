export interface UserData {
  username: string;
  password: string;
}
export interface RegisterData extends UserData {
  email: string;
  fullname: string;
}
interface userProps {
  fullName: string;
  email: string;
  photoURL: string | null | undefined;
  phoneNumber: string;
  address: string;
}
export interface staffModel extends userProps {
  yearOfExperience: number;
}

export interface userModel extends userProps {}
