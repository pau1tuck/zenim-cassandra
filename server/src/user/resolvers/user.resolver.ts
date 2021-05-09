import { Session } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { RegisterInput } from "../models/register-new-user-input.model";
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
    async currentUser(@Session() session: Record<string, any>) {
        return this.userService.readCurrentUser(session);
    }

    @Mutation(returns => Boolean)
    async register(@Args("input") input: RegisterInput) {
        return this.userService.register(input);
    }

    @Mutation(returns => UserModel)
    async login(
        @Args("email") email: string,
        @Args("password") password: string,
        @Session() session: Record<string, any>,
    ) {
        return this.userService.login(email, password, session);
    }
}
