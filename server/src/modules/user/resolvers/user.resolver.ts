import { Session, Request } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Context } from "@nestjs/graphql";
import { UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";
import { RegisterInput } from "../models/register-new-user-input.model";
import { AuthGuard } from "@nestjs/passport";

interface IContext {
    req: Request & { session: any };
    res: Response;
    payload?: { passport: { user: { userId: string; roles: string[] } } };
}

@Resolver((of: any) => UserModel)
export class UserResolver {
    constructor(private userService: UserService) {}

    @Query(returns => [UserModel])
    async allUsers() {
        return this.userService.find();
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
    ) {
        return this.userService.login(email, password);
    }
}
