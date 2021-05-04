import argon2 from "argon2";
import { Injectable } from "@nestjs/common";
import { InjectModel, BaseModel } from "@iaminfinity/express-cassandra";
import { UserEntity } from "./entities/user.entity";
import { RegisterUserInput } from "./models/register-user-input.model";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UserEntity)
        private readonly userModel: BaseModel<UserEntity>,
    ) {}

    async readAllUsers(): Promise<UserEntity[]> {
        return this.userModel.findAsync({}, { raw: true });
    }

    async registerUser(input: RegisterUserInput) {
        const encryptedPassword = await argon2.hash(input.password);

        const newUser = new this.userModel({
            ...input,
            password: encryptedPassword,
            verified: false,
        });

        try {
            newUser.saveAsync();
        } catch (error) {
            console.log(error);
            return false;
        }
        return true;
    }
}
