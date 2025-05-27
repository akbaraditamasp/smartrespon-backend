import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import Base from "./base";
import ComplaintPic from "./complaint_pic";
import User from "./user";
import { Type } from "class-transformer";

@Entity("complaints")
export default class Complaint extends Base {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column()
  public userId!: string;

  @Column()
  public title!: string;

  @Column()
  public description!: string;

  @Column()
  public address!: string;

  @Column("json")
  public coordinates!: {
    latitude: number;
    longitude: number;
  };

  @Column()
  public status!: "SENT" | "RECEIVED" | "ON_PROGRESS" | "HANDLED" | "RESOLVED";

  @OneToMany(() => ComplaintPic, (complaintPic) => complaintPic.complaint, {
    cascade: true,
  })
  public pics?: ComplaintPic[];

  @ManyToOne(() => User, (user) => user.complaints)
  @Type(() => User)
  public user!: Relation<User>;
}
