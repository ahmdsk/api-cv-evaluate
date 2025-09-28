// Dummy simple retrieval, bisa diganti dengan vector DB (Pinecone/Weaviate)
const rubric = `
Technical Skills Match (backend, databases, APIs, cloud, AI/LLM exposure)
Experience Level (years, project complexity)
Relevant Achievements (impact, scale)
Cultural Fit (communication, learning attitude)
Project Deliverable Evaluation (correctness, code quality, resilience, documentation)
`;

export async function retrieveContext(jobDescription: string): Promise<string> {
  return `${jobDescription}\n\nScoring Rubric:\n${rubric}`;
}
