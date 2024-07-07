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
    address: string;
}

interface ProductDetail {
    productId: string;
    productName: string;
    quantity: number;
    totalAmount: number;
}

interface UserInfo {
    userId: string;
    fullName: string;
    role: string;
}