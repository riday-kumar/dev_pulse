import { Pool } from "pg";
import config from "../config/index.js";

export const pool = new Pool({
  connectionString: config.connection_string,
});

export const initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(30),
                email VARCHAR(40) NOT NULL UNIQUE,

                
                password TEXT NOT NULL,
                role VARCHAR(15) DEFAULT 'contributor',

                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
                )            
            `);

    // create table for issues
    await pool.query(`
            CREATE TABLE IF NOT EXISTS issues(
                id SERIAL PRIMARY KEY,
                title VARCHAR(60),
                description TEXT,


                type VARCHAR(20) ,
                status VARCHAR(15) DEFAULT 'open' ,


                reporter_id INT REFERENCES users(id) ON DELETE CASCADE,
                
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        
        `);
    console.log("Database Connected  successfully");
  } catch (error) {
    console.log(error);
  }
};
