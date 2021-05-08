import argon2 from "argon2";
import { Injectable, Session } from "@nestjs/common";
import { InjectModel, BaseModel } from "@iaminfinity/express-cassandra";
import { UserEntity } from "../entities/user.entity";
import { EmailLockEntity } from "../entities/columns/email-lock.entity";
import { RegisterUserInput } from "../models/register-user-input.model";
import { UserModel } from "../models/user.model";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserEntity)
        private readonly userModel: BaseModel<UserEntity>,
        @InjectModel(EmailLockEntity)
        private readonly emailLockModel: BaseModel<EmailLockEntity>,
    ) {}

    async readAllUsers(): Promise<UserEntity[]> {
        return this.userModel.findAsync({}, { raw: true });
    }

    async registerUser(input: RegisterUserInput): Promise<boolean> {
        const encryptedPassword = await argon2.hash(input.password);

        const emailExists = await this.emailLockModel.findOneAsync(
            { email: input.email },
            { raw: true },
        );

        if (emailExists != undefined) {
            throw new Error("Email address already registered");
        }

        const newUser = new this.userModel({
            ...input,
            password: encryptedPassword,
            verified: true,
            roles: ["ADMIN", "MODERATOR"],
        });

        const newEmail = new this.emailLockModel({ email: input.email });

        try {
            newEmail.saveAsync();
            newUser.saveAsync();
        } catch (error) {
            throw new Error(error);
        }
        return true;
    }

    async loginUser(
        email: string,
        password: string,
        @Session() session: Record<string, any>,
    ): Promise<UserModel | null> {
        const matchingUser = await this.userModel.findOneAsync(
            { email },
            { raw: true },
        );
        if (!matchingUser.email && !matchingUser.password) {
            throw new Error("Email address not registered");
        } else {
            const verifyPassword = await argon2.verify(
                matchingUser.password,
                password,
            );
            if (!verifyPassword) {
                throw new Error("Incorrect password");
            }
        }

        if (!matchingUser.verified) {
            throw new Error("Email address not verified");
        }

        session.passport = {
            user: { userId: matchingUser.id, roles: matchingUser.roles },
        };

        return matchingUser;
    }
}
