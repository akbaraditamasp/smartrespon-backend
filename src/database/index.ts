import Complaint from "@app-entities/complaint";
import ComplaintPic from "@app-entities/complaint_pic";
import Upload from "@app-entities/upload";
import User from "@app-entities/user";
import UserToken from "@app-entities/user_token";
import { DataSource } from "typeorm";

export const AppDataSource = () =>
  new DataSource({
    type: "mysql",
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USERNAME ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "pengaduan",
    synchronize: true,
    logging: false,
    entities: [Upload, User, UserToken, Complaint, ComplaintPic],
    subscribers: [],
    migrations: [],
  });
