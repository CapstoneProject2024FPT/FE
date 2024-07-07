export interface OrderProps {
    orderId: string;
    invoiceCode: string;
    createDate: string;
    completedDate: string;
    productList: ProductDetail[];
    totalAmount: number;
    finalAmount: number;
    note: string;
    status: string;
    userInfo: UserInfo;
    address: AddressDetail
}

interface AddressDetail {
    name: string;
    status: string;
    note: string;
    city: CityDetail[];
    district: DistrictDetail[];
    ward: WardDetail[];
}
interface ProductDetail {
    productId: string;
    productName: string;
    quantity: number;
    totalAmount: number;
}

interface CityDetail {
    id: string;
    unitId: number;
    name: string;
}
interface DistrictDetail {
    id: string;
    unitId: number;
    name: string;
}
interface WardDetail {
    id: string;
    unitId: number;
    name: string;
}

interface UserInfo {
    userId: string;
    fullName: string;
    role: string;
}