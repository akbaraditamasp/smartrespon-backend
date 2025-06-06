import { DataSource } from "typeorm";
import { AppDataSource } from "../database";
import Admin from "@app-entities/admin";

export class Database {
  private static instance: Database;
  public source!: DataSource;

  private constructor(source: DataSource) {
    this.source = source;
  }

  public static getInstance() {
    if (!Database.instance) throw new Error("Database not booted yet");

    return Database.instance;
  }

  public static async boot() {
    await AppDataSource()
      .initialize()
      .then((db) => {
        Database.instance = new Database(db);
      });

    if (!(await Admin.count())) {
      await Admin.from({
        email: "admin@pln.co.id",
        plainPassword: "admin123",
        fullname: "Administrator",
      }).save();
    }
  }
}

const db = Database.getInstance;
export default db;
