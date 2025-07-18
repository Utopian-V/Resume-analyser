import { parseCSV } from './csv.js';
export function getInterviewQuestionsByRole(csvText, role) {
  const all = parseCSV(csvText);
  return all.filter(q => q.role === role).sort((a, b) => Number(a.order) - Number(b.order));
} 