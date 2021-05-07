import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { RegisterUserInput } from "../models/register-user-input.model";
import { UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";

@Resolver((of: any) => UserModel)
export class UserResolver {
    constructor(private userService: UserService) {}

    @Query(returns => [UserModel])
    async allUsers() {
        return this.userService.readAllUsers();
    }

    @Query(returns => [UserModel])
    async currentUser() {
        return this.userService.readAllUsers();
    }

    @Mutation(returns => Boolean)
    async register(@Args("input") input: RegisterUserInput) {
        return this.userService.registerUser(input);
    }
}
