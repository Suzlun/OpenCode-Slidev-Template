import type { DeckConfig } from './deck'

export interface ValidationIssue {
  field: string
  message: string
}

export function validateDeckConfig(config: DeckConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  if (!config.name) {
    issues.push({ field: 'name', message: 'name is required' })
  }

  if (!config.title) {
    issues.push({ field: 'title', message: 'title is required' })
  }

  if (!config.theme) {
    issues.push({ field: 'theme', message: 'theme is required' })
  }

  return issues
}
