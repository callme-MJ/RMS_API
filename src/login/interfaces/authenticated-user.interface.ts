import { UserTypes } from "./user-types.enum";

export interface IAuthenticatedUser {
    id: number;
    username: string;
    password: string;
    type: UserTypes;
}