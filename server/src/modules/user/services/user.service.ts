import argon2 from "argon2";
import { Injectable, Param, Session } from "@nestjs/common";
import { InjectModel, BaseModel } from "@iaminfinity/express-cassandra";
import { UserEntity } from "../entities/user.entity";
import { EmailLockEntity } from "../entities/columns/email-lock.entity";
import { RegisterInput } from "../models/register-new-user-input.model";
import { UserModel } from "../models/user.model";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserEntity)
        private readonly userModel: BaseModel<UserEntity>,
        @InjectModel(EmailLockEntity)
        private readonly emailLockModel: BaseModel<EmailLockEntity>,
    ) {}

    async find(): Promise<UserEntity[]> {
        return this.userModel.findAsync({}, { raw: true });
    }

    async findOne(email: string): Promise<UserEntity | undefined> {
        return this.userModel.findOneAsync({ email }, { raw: true });
    }

    async readCurrentUser(session: any): Promise<UserModel | null> {
        const currentUser: UserModel = await this.userModel.findOneAsync(
            { id: session.passport.user.userId },
            { raw: true },
        );
        if (currentUser.id) {
            return currentUser;
        } else {
            return null;
        }
    }

    async register(input: RegisterInput): Promise<boolean> {
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

    async login(
        email: string,
        password: string,
    ): Promise<UserModel | undefined> {
        const matchingUser = await this.userModel.findOneAsync(
            { email: email },
            { raw: true },
        );
        if (!matchingUser) {
            throw new Error("Email address not registered");
        }
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

        return matchingUser;
    }
}
