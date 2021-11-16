export class CreateUserDto {
    id: string;
    fullName: string;
    email: string;
    password: string;
    profilePhoto: string;
    authProvider: string;
    isActive: boolean;
    roleCode: string;
    roleName: string;
    checked?: boolean = false;
}

export class UserDto {
    email: string;
    password: string;
}

export class UserAuthenticationTokenDto {
    accessToken: string;
    expireAt: string;
    firstName: string;
    id: string;
    lastName: string;
    refreshToken: string;
    userName: string;
}

export class VerifySecurityTokenDto {
    email: string;
    securityToken: string;
}