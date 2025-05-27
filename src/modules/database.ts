import { DataSource } from "typeorm";
import { AppDataSource } from "../database";

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
    return AppDataSource()
      .initialize()
      .then((db) => {
        Database.instance = new Database(db);
      });
  }
}

const db = Database.getInstance;
export default db;
