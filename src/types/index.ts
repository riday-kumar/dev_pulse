export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: "contributor" | "maintainer";
}

export interface ISignin {
  email: string;
  password: string;
}

export type ROLES = "contributor" | "maintainer";
