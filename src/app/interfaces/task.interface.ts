import type { TaskStatusType } from "../types/task-status";
import type { IComment } from "./comment.interface";

export interface ITask {
  id: string;
  name: string;
  description: string;
  comments: IComment[];
  status: TaskStatusType;
}
