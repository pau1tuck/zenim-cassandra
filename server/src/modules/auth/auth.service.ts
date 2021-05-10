import { Injectable } from "@nestjs/common";
import { UserService } from "../user/services/user.service";
import argon2 from "argon2";

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findOne(email);
        if (!user) {
            throw new Error("Email address not registered");
        }
        const verifyPassword = await argon2.verify(user.password, password);
        if (!verifyPassword) {
            throw new Error("Incorrect password");
        }
        if (!user.verified) {
            throw new Error("Email address not verified");
        }
        /*
        if (user && user.password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
        */
        return user;
    }
}
