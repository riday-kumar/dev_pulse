import { pool } from "../../db/index.js";
import type { IPostIssue, IQuery } from "./issues.interface.js";

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

  const allIssues = (
    await pool.query(
      `
        SELECT * FROM issues
        WHERE (type = $1 OR $1 IS NULL) AND
        (status = $2 OR $2 IS NULL)
        ORDER BY created_at  ${organize}
    
    `,
      [type, status],
    )
  ).rows;

  const allReportersId = allIssues.map(
    (singleIssue) => singleIssue.reporter_id,
  );
  const uniqueReportersId = [...new Set(allReportersId)];
  //   console.log(uniqueReportersId);

  const allReportedUsers = (
    await pool.query(`SELECT id, name, role FROM users WHERE id = ANY($1)`, [
      uniqueReportersId,
    ])
  ).rows;

  const issuesWithReporters = allIssues.map((issue) => {
    const reporter = allReportedUsers.find(
      (user) => user.id === issue.reporter_id,
    );

    return { ...issue, reporter };
  });

  //   console.log(issuesWithReporters);
  return issuesWithReporters;
};

export const issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
};
