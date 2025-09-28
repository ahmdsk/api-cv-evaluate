export interface TaskResult {
  cv: {
    technical_skills: number
    experience_level: number
    achievements: number
    cultural_fit: number
    match_rate: number
    feedback: string
  }
  project: {
    correctness: number
    code_quality: number
    resilience: number
    documentation: number
    creativity: number
    score: number
    feedback: string
  }
  overall_summary: string
}

export type Task =
  | { status: "queued" }
  | { status: "processing" }
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
