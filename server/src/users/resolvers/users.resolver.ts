import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { RegisterUserInput } from "../models/register-user-input.model";
import { User } from "../models/user.model";
import { UsersService } from "../users.service";

@Resolver((of: any) => User)
export class UsersResolver {
    constructor(private usersService: UsersService) {}

    @Query(returns => [User])
    async users() {
        return this.usersService.readAllUsers();
    }

    @Mutation(returns => Boolean)
    async register(@Args("input") input: RegisterUserInput) {
        return this.usersService.registerUser(input);
    }
}
