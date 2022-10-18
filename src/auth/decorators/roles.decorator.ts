import { SetMetadata } from "@nestjs/common";

export const Roles = (...role:string[]) =>SetMetadata('roles', role)
// export const IS_PUBLIC_KEY = 'isPublic';
// export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
