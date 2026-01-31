export interface DeckOutputs {
  pdf?: string
  pptx?: string
}

export interface DeckConfig {
  name: string
  title: string
  template?: string
  theme?: string
  addons?: string[]
  outputs?: DeckOutputs
}
