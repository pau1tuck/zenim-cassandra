import { Entity, Column } from "@iaminfinity/express-cassandra";

@Entity({
    table_name: "email_lock",
    key: ["email"],
})
export class EmailLockEntity {
    @Column({
        type: "text",
    })
    email!: string;
}
