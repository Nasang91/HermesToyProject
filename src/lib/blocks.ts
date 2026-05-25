     1|     1|export type BlockId =
     2|     2|  | 'grass'
     3|     3|  | 'stone'
     4|     4|  | 'dirt'
     5|     5|  | 'sand'
     6|     6|  | 'wood'
     7|     7|  | 'water'
     8|     8|  | 'flower'
     9|     9|  | 'brick'
    10|    10|  | 'glass'
    11|    11|  | 'muddy_water'
    12|    12|  | 'clay'
    13|    13|  | 'moss'
    14|    14|
    15|    15|export type BlockType = {
    16|    16|  id: BlockId
    17|    17|  name: string
    18|    18|  color: string
    19|    19|  isDiscoverable: boolean
    20|    20|}
    21|    21|
    22|    22|export type Recipe = {
    23|    23|  ingredients: [BlockId, BlockId]
    24|    24|  result: BlockId
    25|    25|}
    26|    26|
    27|    27|export const blockTypes: BlockType[] = [
    28|    28|  { id: 'grass', name: 'Grass', color: '#4caf50', isDiscoverable: false },
    29|    29|  { id: 'stone', name: 'Stone', color: '#8e8e8e', isDiscoverable: false },
    30|    30|  { id: 'dirt', name: 'Dirt', color: '#8b5a2b', isDiscoverable: false },
    31|    31|  { id: 'sand', name: 'Sand', color: '#f4c542', isDiscoverable: false },
    32|    32|  { id: 'wood', name: 'Wood', color: '#8B4513', isDiscoverable: false },
    33|    33|  { id: 'water', name: 'Water', color: '#1E90FF', isDiscoverable: false },
    34|    34|  { id: 'flower', name: 'Flower', color: '#FF69B4', isDiscoverable: true },
    35|    35|  { id: 'brick', name: 'Brick', color: '#B22222', isDiscoverable: true },
    36|    36|  { id: 'glass', name: 'Glass', color: '#87CEEB', isDiscoverable: true },
    37|    37|  { id: 'muddy_water', name: 'Muddy Water', color: '#6B4423', isDiscoverable: true },
    38|    38|  { id: 'clay', name: 'Clay', color: '#CD853F', isDiscoverable: true },
    39|    39|  { id: 'moss', name: 'Moss', color: '#6b8e23', isDiscoverable: true },
    40|    40|]
    41|    41|
    42|    42|export const recipes: Recipe[] = [
    43|    43|  { ingredients: ['grass', 'sand'], result: 'flower' },
    44|    44|  { ingredients: ['stone', 'dirt'], result: 'brick' },
    45|    45|  { ingredients: ['sand', 'water'], result: 'glass' },
    46|    46|  { ingredients: ['dirt', 'water'], result: 'muddy_water' },
    47|    47|  { ingredients: ['wood', 'dirt'], result: 'clay' },
    48|    48|  { ingredients: ['grass', 'water'], result: 'moss' },
    49|    49|]
    50|    50|
    51|    51|export const findCombinationResult = (
    52|    52|  existingBlockId: BlockId,
    53|    53|  placedBlockId: BlockId,
    54|    54|): BlockId | null => {
    55|    55|  for (const recipe of recipes) {
    56|    56|    const [ingredient1, ingredient2] = recipe.ingredients
    57|    57|
    58|    58|    if (
    59|    59|      (existingBlockId === ingredient1 && placedBlockId === ingredient2) ||
    60|    60|      (existingBlockId === ingredient2 && placedBlockId === ingredient1)
    61|    61|    ) {
    62|    62|      return recipe.result
    63|    63|    }
    64|    64|  }
    65|    65|
    66|    66|  return null
    67|    67|}
    68|    68|
    69|    69|export const isBlockId = (value: unknown): value is BlockId =>
    70|    70|  typeof value === 'string' && blockTypes.some((block) => block.id === value)
    71|    71|
    72|    72|export const findBlockById = (id: BlockId): BlockType =>
    73|    73|  blockTypes.find((block) => block.id === id) ?? blockTypes[0]
    74|    74|