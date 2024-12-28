import { AIRecommendation } from '../types/recommendations';

export function validateRecommendations(data: unknown): asserts data is AIRecommendation[] {
  if (!Array.isArray(data)) {
    throw new Error('Invalid response format: expected an array');
  }

  data.forEach((rec, index) => {
    if (!isValidRecommendation(rec)) {
      throw new Error(`Invalid recommendation at index ${index}: missing title or reason`);
    }
  });
}

function isValidRecommendation(rec: unknown): rec is AIRecommendation {
  return (
    typeof rec === 'object' &&
    rec !== null &&
    'title' in rec &&
    'reason' in rec &&
    typeof (rec as any).title === 'string' &&
    typeof (rec as any).reason === 'string'
  );
}