import { hash } from "argon2";
import { Exclude, Type } from "class-transformer";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Base from "./base";
import Complaint from "./complaint";
import UserToken from "./user_token";

@Entity("users")
export default class User extends Base {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column()
  public fullname!: string;

  @Column()
  @Exclude()
  public password!: string;

  @Column({
    unique: true,
  })
  public email!: string;

  @Exclude({
    toPlainOnly: true,
  })
  public plainPassword!: string;

  @OneToMany(() => UserToken, (token) => token.user)
  @Type(() => UserToken)
  public tokens?: UserToken[];

  @BeforeInsert()
  @BeforeUpdate()
  public async sanitize() {
    if (this.plainPassword) {
      this.password = await hash(this.plainPassword);
    }
    if (this.email) this.email = this.email.toLowerCase();
  }

  @OneToMany(() => Complaint, (complaint) => complaint.user)
  @Type(() => Complaint)
  public complaints?: Complaint[];
}
