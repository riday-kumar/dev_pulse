import { pool } from "../../db/index.js";

interface IPostIssue {
  title: string;
  description: string;
  type: "bug" | "feature_request";
  reporter_id: number;
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

export const issuesService = {
  createIssuesIntoDB,
};
