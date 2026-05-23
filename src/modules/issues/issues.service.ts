import { pool } from "../../db/index.js";
import type { IPostIssue, IQuery } from "./issues.interface.js";

const createIssuesIntoDB = async (payLoad: IPostIssue, reporter_id: number) => {
  const { title, description, type } = payLoad;
  // console.log(payLoad);
  const result = await pool.query(
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

    const result = {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: {
        id: reporter.id,
        name: reporter.name,
        role: reporter.role,
      },
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };

    return result;
  });

  //   console.log(issuesWithReporters);
  return issuesWithReporters;
};

const getSingleIssueFromDB = async (id: string) => {
  // console.log(id);

  const singleIssue = (
    await pool.query(
      `
        SELECT * FROM issues WHERE id = $1
        `,
      [id],
    )
  ).rows[0];

  if (!singleIssue) {
    throw new Error("No Issue Found");
  }

  const reporterId = singleIssue.reporter_id;
  const reporterData = (
    await pool.query(`
        SELECT id, name ,role FROM users WHERE id = ${reporterId}
    `)
  ).rows[0];

  const result = {
    id: singleIssue.id,
    title: singleIssue.title,
    description: singleIssue.description,
    type: singleIssue.type,
    status: singleIssue.status,
    reporter: {
      id: reporterData.id,
      name: reporterData.name,
      role: reporterData.role,
    },
    created_at: singleIssue.created_at,
    updated_at: singleIssue.updated_at,
  };

  return result;
};

const updateIssueFromDB = async (
  id: string,
  payLoad: IPostIssue,
  reporter_id: number,
  reporter_role: string,
) => {
  // console.log(id, payLoad);
  const { title, description, type } = payLoad;

  const selectedIssue = (
    await pool.query(`
    SELECT * FROM issues WHERE id = ${id}
    `)
  ).rows[0];

  if (!selectedIssue) {
    throw new Error("issue not found");
  }

  if (reporter_role === "maintainer") {
    const updateIssueByMaintainer = pool.query(
      `
      UPDATE issues SET title = COALESCE($1,title) , description = COALESCE($2,description),
       type = COALESCE($3, type) WHERE id = ${id} RETURNING *
      
      `,
      [title, description, type],
    );
    return updateIssueByMaintainer;
  }

  if (
    reporter_role === "contributor" &&
    selectedIssue.reporter_id === reporter_id &&
    selectedIssue.status === "open"
  ) {
    const updateIssueByContributor = pool.query(
      `
      UPDATE issues SET title = COALESCE($1,title) , description = COALESCE($2,description),
       type = COALESCE($3, type) WHERE id = ${id} RETURNING *
      
      `,
      [title, description, type],
    );
    return updateIssueByContributor;
  } else {
    throw new Error("Forbidden");
  }
};

const deleteIssueFromDB = async (id: string) => {
  const selectedIssue = (
    await pool.query(`
    SELECT * FROM issues WHERE id = ${id}
    `)
  ).rows[0];

  if (!selectedIssue) {
    throw new Error("issue not found");
  }

  const result = await pool.query(
    `
    DELETE FROM issues WHERE id = $1
    `,
    [id],
  );

  // console.log("from delete service", result);
  return result;
};

export const issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueFromDB,
  deleteIssueFromDB,
};
