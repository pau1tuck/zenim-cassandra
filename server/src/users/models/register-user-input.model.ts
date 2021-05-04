import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class RegisterUserInput {
    @Field({ nullable: true })
    givenName: string;

    @Field({ nullable: true })
    familyName?: string;

    @Field({ nullable: true })
    country?: string;

    @Field({ nullable: true })
    username?: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    password!: string;
}
