export interface IPostIssue {
  title: string;
  description: string;
  type: "bug" | "feature_request";
  reporter_id: number;
}

export interface IQuery {
  type?: string;
  status?: string;
  sort?: string;
}
