import { pool } from "../../db/index.js";
import type { IUser } from "../../types/index.js";

interface IPostIssue {
  title: string;
  description: string;
  type: "bug" | "feature_request";
  reporter_id: number;
}

interface IQuery {
  type: string;
  status: string;
  sort: string;
}

const createIssuesIntoDB = async (payLoad: IPostIssue) => {
  const { title, description, type, reporter_id } = payLoad;
  console.log(payLoad);
  const result = pool.query(
    `
        INSERT INTO issues(title, description, type, reporter_id)
        VALUES($1,$2,$3,$4)
        RETURNING id, title, description, type, status,reporter_id,created_at,updated_at
        `,
    [title, description, type, reporter_id],
  );

  return result;
};

const getAllIssuesFromDB = async (query: IQuery) => {
  const { type, status, sort } = query;
  let organize: string = "DESC";
  if (sort == "oldest") {
    organize = "ASC";
  }

  const result = await pool.query(
    `
         SELECT 
        issues.id,
        issues.title,
        issues.description,
        issues.type,
        issues.status,

        json_build_object(
          'id', users.id,
          'name', users.name,
          'role', users.role
        ) AS reporter,
        issues.created_at,
        issues.updated_at

      FROM issues 

      LEFT JOIN users
      ON issues.reporter_id = users.id WHERE (issues.type = $1 OR $1 IS NULL) 
      AND (issues.status = $2 OR $2 IS NULL)
    ORDER BY issues.created_at  ${organize}

        `,
    [type, status],
  );
  return result;
};

export const issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
};
