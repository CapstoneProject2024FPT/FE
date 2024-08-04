export interface addressForm {
  name: string;
  note: string;
  cityId: string;
  districtId: string;
  wardId: string;
  namePersonal: string;
  phoneNumber: string;
}

export interface updateAddress {
  namePersonal: string;
  phoneNumber: string;
  name: string;
}

export interface provincesProps {
  id: string;
  name: string;
  status: string;
}

export interface wardProps extends provincesProps {
  district: {
    id: string;
    unitId?: number;
    name: string;
  };
}

export interface districtProps extends provincesProps {
  city: {
    id: string;
    unitId?: number;
    name: string;
  };
}

export interface addressProps {
  id: string;
  name: string;
  status: string;
  note: string;
  namePersonal: string;
  phoneNumber: string;
  city: {
    id: string;
    unitId: number;
    name: string;
  };
  district: {
    id: string;
    unitId: number;
    name: string;
  };
  ward: {
    id: string;
    unitId: number;
    name: string;
  };
  account: {
    id: string;
    fullName: string;
    role: string;
  };
}
