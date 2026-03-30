import { RoleEnum } from "../../authorization";

export interface RegisterInterface {
    email: string;
    identifier: string;
    password: string;
    role?: RoleEnum;
}
