import { TransformDate, transformDate } from "@app-utils/transform-date";
import { Exclude, Type } from "class-transformer";
import { DateTime } from "luxon";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import Base from "./base";
import User from "./user";

@Entity("user_tokens")
export default class UserToken extends Base {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ default: null, nullable: true })
  public name!: string;

  @Column()
  @Exclude()
  public hashed!: string;

  @Column({ type: "timestamp", nullable: true, transformer: transformDate })
  @TransformDate()
  public expiredAt!: DateTime;

  @Column()
  public userId!: string;

  @ManyToOne(() => User, (user) => user.tokens, { cascade: true })
  @Type(() => User)
  public user?: Relation<User>;
}
