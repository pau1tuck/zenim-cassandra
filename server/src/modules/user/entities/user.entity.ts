import {
    Entity,
    Column,
    CreateDateColumn,
    GeneratedUUidColumn,
    UpdateDateColumn,
} from "@iaminfinity/express-cassandra";

@Entity({
    table_name: "user",
    key: ["email", "id"],
})
export class UserEntity {
    @GeneratedUUidColumn()
    id!: string;

    @Column({
        type: "text",
    })
    email?: string;

    @Column({
        type: "text",
    })
    password!: string;

    @Column({
        type: "text",
    })
    displayName?: string;

    @Column({
        type: "text",
    })
    givenName?: string;

    @Column({
        type: "text",
    })
    familyName?: string;

    @Column({
        type: "text",
    })
    city?: string;

    @Column({
        type: "text",
    })
    country?: string;

    @Column({
        type: "boolean",
    })
    verified!: boolean;

    @Column({
        type: "list",
        typeDef: "<text>",
    })
    roles?: string[];

    @Column({
        type: "text",
    })
    facebookId?: string;

    @Column({
        type: "text",
    })
    googleId?: string;

    @Column({
        type: "text",
    })
    twitterId?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
