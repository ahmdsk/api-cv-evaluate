export interface TaskResult {
  cv_match_rate: number
  cv_feedback: string
  project_score: number
  project_feedback: string
  overall_summary: string
}

export type Task =
  | { status: "queued" }
  | { status: "completed"; result: TaskResult }
  | { status: "failed"; error: string }

const tasks: Record<string, Task> = {}

export function addTask(id: string, data: Task): void {
  tasks[id] = data
}

export function updateTask(id: string, data: Task): void {
  tasks[id] = data
}

export function getTask(id: string): Task | undefined {
  return tasks[id]
}
