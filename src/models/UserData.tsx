interface UserData {
  id: string;
  username: string;
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

export default UserData;
