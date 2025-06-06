import { Type } from "class-transformer";
import {
  BeforeRemove,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import Base from "./base";
import Complaint from "./complaint";
import Upload from "./upload";

@Entity("complaint_pics")
export default class ComplaintPic extends Base {
  @PrimaryGeneratedColumn("uuid")
  public id!: string;

  @Column()
  public complaintId!: string;

  @ManyToOne(() => Complaint, (complaint) => complaint.pics)
  @Type(() => Complaint)
  public complaint!: Relation<Complaint>;

  @OneToOne(() => Upload, {
    cascade: true,
    onDelete: "CASCADE",
    eager: true,
  })
  @JoinColumn()
  public file!: Relation<Upload>;

  @BeforeRemove()
  public async removeUploaded() {
    await this.file.remove();
  }
}
