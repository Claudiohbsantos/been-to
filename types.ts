// TO ADD A USER
// METHOD: Post
// ROUTE: /user/createuser

// REQ.BODY:
export interface AddUserType {
  // id: number; autogenerated in db
  username: string;
  email: string;
  password: string;
  // created_at: timestamp; default in db
  countrycodes: string[];
}

// TO GET A USER'S COUNTRY CODES:
// METHOD: Get
// ROUTE: /user/getuser

// REQ.QUERY:
export interface GetUserType {
  id: number;
}

// RES.BODY:
export type GetAllCCType = string[];

// TO UPDATE A USER'S COUNTRY CODES:
// METHOD: POST
// ROUTE: /locations/addlocation/

// REQ
export interface AddLocationQueryType {
  id: number;
}
// REQ.BODY:
export interface AddLocationBodyType {
  countrycodes: string[];
}

// RES.BODY:
export type AddAndGetCCType = string[];
