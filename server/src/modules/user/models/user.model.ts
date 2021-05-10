import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserModel {
    @Field()
    id!: string;

    @Field({ nullable: true })
    givenName?: string;

    @Field({ nullable: true })
    familyName?: string;

    @Field({ nullable: true })
    city?: string;

    @Field({ nullable: true })
    country?: string;

    @Field({ nullable: true })
    username?: string;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    password!: string;

    @Field({ defaultValue: false })
    verified!: boolean;

    @Field(() => [String], { nullable: true })
    roles?: string[];

    @Field({ nullable: true })
    facebookId?: string;

    @Field({ nullable: true })
    googleId?: string;

    @Field({ nullable: true })
    twitterId?: string;

    @Field()
    createdAt!: Date;

    @Field()
    updatedAt!: Date;
}
