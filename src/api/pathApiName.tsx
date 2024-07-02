export const LOGIN = "/auth/login";
export const REGISTER = "/users";

//Machinery
export const GET_MACHINERY = "/machinery";
export const ADD_MACHINERY = "/Machinery";
export const MACHINERY_LIST = "machinery";
export const MACHINERY_ID = "/Machinery/:id";
export const MACHINERY_DETAIL = "Machinery/Detail";
export const MACHINERY_HOME_PRIORITY = "Machinery?Priority=1";

//Category
export const GET_CATEGORY = "categories?status=Active";
export const CATEGORY_ID = "categories/:id";
export const CATEGORY = "categories";
export const GET_CATEGORY_PARENT = "categories?status=Active&type=Parent";

//brand
export const GET_BRAND = "brand?status=Active";
export const BRAND_ID = "brand/:id";
export const BRAND = "brand";
//Customer
export const CUSTOMER_PROFILE = "/users/:id";

//checkout
export const CHECKOUT = "/orders";

//origin
export const ORIGIN = "origin";

//brand
export const GET_BRAND_NAME = "/brand";

//warranty
export const GET_WARRANTY = "/warranty";
//serialNumer
export const SERIALNUMBER = "inventories";
export const SERIALNUMBER_ID = "inventories/:id";

//rank
export const RANK = "rank";
export const RANK_ID = "rank/:id";
