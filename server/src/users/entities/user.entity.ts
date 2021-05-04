import {
    Entity,
    Column,
    CreateDateColumn,
    GeneratedUUidColumn,
    UpdateDateColumn,
} from "@iaminfinity/express-cassandra";

@Entity({
    table_name: "user",
    key: ["id"],
})
export class UserEntity {
    @GeneratedUUidColumn()
    id!: string;

    @Column({
        type: "varchar",
    })
    givenName?: string;

    @Column({
        type: "varchar",
    })
    familyName?: string;

    @Column({
        type: "varchar",
    })
    city?: string;

    @Column({
        type: "varchar",
    })
    country?: string;

    @Column({
        type: "varchar",
    })
    username?: string;

    @Column({
        type: "varchar",
    })
    email?: string;

    @Column({
        type: "varchar",
    })
    password!: string;

    @Column({
        type: "boolean",
        default: "false",
    })
    verified!: boolean;

    @Column({
        type: "list",
        typeDef: "<varchar>",
    })
    roles?: string[];

    @Column({
        type: "varchar",
    })
    facebookId?: string;

    @Column({
        type: "varchar",
    })
    googleId?: string;

    @Column({
        type: "varchar",
    })
    twitterId?: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
