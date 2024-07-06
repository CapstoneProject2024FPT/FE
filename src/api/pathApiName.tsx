//auth
export const LOGIN = "/auth/login";
export const REGISTER = "register/users";
export const CHANGE_PASSWORD = "/users/:id/password";

//Machinery
export const GET_MACHINERY = "/machinery/noPaginate";
export const ADD_MACHINERY = "/Machinery";
export const MACHINERY = "/Machinery";
export const MACHINERY_LIST = "Machinery/noPaginate";
export const MACHINERY_ID = "/Machinery/:id";
export const MACHINERY_DETAIL = "Machinery/Detail";
export const MACHINERY_HOME_PRIORITY = "Machinery?Priority=1&size=4";

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

//accont
export const USER_BY_ROLE = "users";
export const USER_ID = "users/:id";
//news
export const NEWS_HOME = "news";
export const NEWS_ID = "news/:id";
export const NEWS_ADMIN = "news/noPaginate";

//newsCategories
export const NEWS_CATEGORIES = "/newsCategory";
export const NEWS_CATEGORIES_ID = "/newsCategory/:id";

//create
export const STAFF = "register/staff";

//address
export const GET_CITY = "city";
export const GET_DISTRICT = "district";
export const GET_WARD = "ward";
export const GET_ADDRESS = "address";
