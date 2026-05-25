export type BlockId =
  | 'grass'
  | 'stone'
  | 'dirt'
  | 'sand'
  | 'wood'
  | 'water'
  | 'flower'
  | 'brick'
  | 'glass'
  | 'muddy_water'
  | 'clay'
  | 'moss'
  | 'charcoal'

export type BlockType = {
  id: BlockId
  name: string
  color: string
  isDiscoverable: boolean
}

export type Recipe = {
  ingredients: [BlockId, BlockId]
  result: BlockId
}

export const blockTypes: BlockType[] = [
  { id: 'grass', name: 'Grass', color: '#4caf50', isDiscoverable: false },
  { id: 'stone', name: 'Stone', color: '#8e8e8e', isDiscoverable: false },
  { id: 'dirt', name: 'Dirt', color: '#8b5a2b', isDiscoverable: false },
  { id: 'sand', name: 'Sand', color: '#f4c542', isDiscoverable: false },
  { id: 'wood', name: 'Wood', color: '#8B4513', isDiscoverable: false },
  { id: 'water', name: 'Water', color: '#1E90FF', isDiscoverable: false },
  { id: 'flower', name: 'Flower', color: '#FF69B4', isDiscoverable: true },
  { id: 'brick', name: 'Brick', color: '#B22222', isDiscoverable: true },
  { id: 'glass', name: 'Glass', color: '#87CEEB', isDiscoverable: true },
  { id: 'muddy_water', name: 'Muddy Water', color: '#6B4423', isDiscoverable: true },
  { id: 'clay', name: 'Clay', color: '#CD853F', isDiscoverable: true },
  { id: 'moss', name: 'Moss', color: '#6b8e23', isDiscoverable: true },
  { id: 'charcoal', name: 'Charcoal', color: '#2f2f2f', isDiscoverable: true },
]

export const recipes: Recipe[] = [
  { ingredients: ['grass', 'sand'], result: 'flower' },
  { ingredients: ['stone', 'dirt'], result: 'brick' },
  { ingredients: ['sand', 'water'], result: 'glass' },
  { ingredients: ['dirt', 'water'], result: 'muddy_water' },
  { ingredients: ['wood', 'dirt'], result: 'clay' },
  { ingredients: ['grass', 'water'], result: 'moss' },
  { ingredients: ['sand', 'wood'], result: 'charcoal' },
]

export const findCombinationResult = (
  existingBlockId: BlockId,
  placedBlockId: BlockId,
): BlockId | null => {
  for (const recipe of recipes) {
    const [ingredient1, ingredient2] = recipe.ingredients

    if (
      (existingBlockId === ingredient1 && placedBlockId === ingredient2) ||
      (existingBlockId === ingredient2 && placedBlockId === ingredient1)
    ) {
      return recipe.result
    }
  }

  return null
}

export const isBlockId = (value: unknown): value is BlockId =>
  typeof value === 'string' && blockTypes.some((block) => block.id === value)

export const findBlockById = (id: BlockId): BlockType =>
  blockTypes.find((block) => block.id === id) ?? blockTypes[0]
