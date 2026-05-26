import { useEffect, useState } from 'react'
import './App.css'

type BlockId =
  | 'grass'
  | 'stone'
  | 'dirt'
  | 'sand'
  | 'wood'
  | 'water'
  | 'fire'
  | 'wind'
  | 'flower'
  | 'brick'
  | 'glass'
  | 'muddy_water'
  | 'clay'

type BlockType = {
  id: BlockId
  name: string
  color: string
  isDiscoverable: boolean
}

type GridCell = BlockType | null
type Grid = GridCell[][]
type SelectedTool =
  | { kind: 'block'; block: BlockType }
  | { kind: 'eraser' }

type Recipe = {
  ingredients: [BlockId, BlockId]
  result: BlockId
}

const GRID_COLUMNS = 20
const GRID_ROWS = 15
const STORAGE_KEY = 'miniBlockBuilder_grid'
const DISCOVERED_KEY = 'miniBlockBuilder_discovered'

const blockTypes: BlockType[] = [
  { id: 'grass', name: 'Grass', color: '#4caf50', isDiscoverable: false },
  { id: 'stone', name: 'Stone', color: '#8e8e8e', isDiscoverable: false },
  { id: 'dirt', name: 'Dirt', color: '#8b5a2b', isDiscoverable: false },
  { id: 'sand', name: 'Sand', color: '#f4c542', isDiscoverable: false },
  { id: 'wood', name: 'Wood', color: '#8B4513', isDiscoverable: false },
  { id: 'water', name: 'Water', color: '#1E90FF', isDiscoverable: false },
  { id: 'fire', name: 'Fire', color: '#FF4500', isDiscoverable: false },
  { id: 'wind', name: 'Wind', color: '#E0FFFF', isDiscoverable: false },
  { id: 'flower', name: 'Flower', color: '#FF69B4', isDiscoverable: true },
  { id: 'brick', name: 'Brick', color: '#B22222', isDiscoverable: true },
  { id: 'glass', name: 'Glass', color: '#87CEEB', isDiscoverable: true },
  { id: 'muddy_water', name: 'Muddy Water', color: '#6B4423', isDiscoverable: true },
  { id: 'clay', name: 'Clay', color: '#CD853F', isDiscoverable: true },
]

const recipes: Recipe[] = [
  { ingredients: ['grass', 'sand'], result: 'flower' },
  { ingredients: ['stone', 'dirt'], result: 'brick' },
  { ingredients: ['sand', 'water'], result: 'glass' },
  { ingredients: ['dirt', 'water'], result: 'muddy_water' },
  { ingredients: ['wood', 'dirt'], result: 'clay' },
]

const findCombinationResult = (
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

// Start every cell empty; each position later stores the placed block type.
const createEmptyGrid = (): Grid =>
  Array.from({ length: GRID_ROWS }, () =>
    Array.from<GridCell>({ length: GRID_COLUMNS }).fill(null),
  )

const isBlockId = (value: unknown): value is BlockId =>
  typeof value === 'string' && blockTypes.some((block) => block.id === value)

const findBlockById = (id: BlockId): BlockType =>
  blockTypes.find((block) => block.id === id) ?? blockTypes[0]

const parseSavedGrid = (savedValue: string): Grid | null => {
  const parsed: unknown = JSON.parse(savedValue)

  if (!Array.isArray(parsed) || parsed.length !== GRID_ROWS) {
    return null
  }

  const restoredGrid: Grid = []

  for (const row of parsed) {
    if (!Array.isArray(row) || row.length !== GRID_COLUMNS) {
      return null
    }

    const restoredRow: GridCell[] = []

    for (const cell of row) {
      if (cell === null) {
        restoredRow.push(null)
        continue
      }

      if (
        typeof cell === 'object' &&
        cell !== null &&
        'id' in cell &&
        isBlockId(cell.id)
      ) {
        restoredRow.push(findBlockById(cell.id))
        continue
      }

      return null
    }

    restoredGrid.push(restoredRow)
  }

  return restoredGrid
}

function App() {
  const [selectedTool, setSelectedTool] = useState<SelectedTool>({
    kind: 'block',
    block: blockTypes[0],
  })
  const [grid, setGrid] = useState(createEmptyGrid)
  const [statusMessage, setStatusMessage] = useState('')
  const [discoveredBlocks, setDiscoveredBlocks] = useState<Set<BlockId>>(() => {
    const saved = localStorage.getItem(DISCOVERED_KEY)
    if (saved) {
      try {
        return new Set(JSON.parse(saved))
      } catch {
        return new Set()
      }
    }
    return new Set()
  })

  useEffect(() => {
    if (!statusMessage) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setStatusMessage('')
    }, 2000)

    return () => window.clearTimeout(timeoutId)
  }, [statusMessage])

  useEffect(() => {
    localStorage.setItem(DISCOVERED_KEY, JSON.stringify(Array.from(discoveredBlocks)))
  }, [discoveredBlocks])

  const checkForRecipes = (newGrid: Grid) => {
    const newlyDiscovered: BlockId[] = []

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLUMNS - 1; col++) {
        const cell1 = newGrid[row][col]
        const cell2 = newGrid[row][col + 1]

        if (!cell1 || !cell2) continue

        for (const recipe of recipes) {
          const [ing1, ing2] = recipe.ingredients
          if (
            ((cell1.id === ing1 && cell2.id === ing2) ||
             (cell1.id === ing2 && cell2.id === ing1)) &&
            !discoveredBlocks.has(recipe.result)
          ) {
            newlyDiscovered.push(recipe.result)
          }
        }
      }
    }

    for (let row = 0; row < GRID_ROWS - 1; row++) {
      for (let col = 0; col < GRID_COLUMNS; col++) {
        const cell1 = newGrid[row][col]
        const cell2 = newGrid[row + 1][col]

        if (!cell1 || !cell2) continue

        for (const recipe of recipes) {
          const [ing1, ing2] = recipe.ingredients
          if (
            ((cell1.id === ing1 && cell2.id === ing2) ||
             (cell1.id === ing2 && cell2.id === ing1)) &&
            !discoveredBlocks.has(recipe.result)
          ) {
            newlyDiscovered.push(recipe.result)
          }
        }
      }
    }

    if (newlyDiscovered.length > 0) {
      setDiscoveredBlocks((prev) => {
        const updated = new Set(prev)
        newlyDiscovered.forEach((blockId) => updated.add(blockId))
        return updated
      })

      const blockNames = newlyDiscovered
        .map((id) => findBlockById(id).name)
        .join(', ')
      setStatusMessage(`새로운 블록 발견: ${blockNames}!`)
    }
  }

  const updateCell = (rowIndex: number, columnIndex: number) => {
    // Build a new grid so React can detect and render the changed cell.
    setGrid((currentGrid) => {
      const currentCell = currentGrid[rowIndex][columnIndex]

      if (selectedTool.kind === 'eraser') {
        const newGrid = currentGrid.map((row, currentRowIndex) =>
          row.map((cell, currentColumnIndex) =>
            currentRowIndex === rowIndex && currentColumnIndex === columnIndex
              ? null
              : cell,
          ),
        )
        checkForRecipes(newGrid)
        return newGrid
      }

      if (currentCell) {
        const combinationResult = findCombinationResult(currentCell.id, selectedTool.block.id)

        if (!combinationResult) {
          return currentGrid
        }

        const combinedBlock = findBlockById(combinationResult)
        const newGrid = currentGrid.map((row, currentRowIndex) =>
          row.map((cell, currentColumnIndex) =>
            currentRowIndex === rowIndex && currentColumnIndex === columnIndex
              ? combinedBlock
              : cell,
          ),
        )

        if (!discoveredBlocks.has(combinationResult)) {
          setDiscoveredBlocks((prev) => {
            const updated = new Set(prev)
            updated.add(combinationResult)
            return updated
          })
          setStatusMessage(`새로운 블록 발견: ${combinedBlock.name}!`)
        }

        checkForRecipes(newGrid)
        return newGrid
      }

      const newGrid = currentGrid.map((row, currentRowIndex) =>
        row.map((cell, currentColumnIndex) =>
          currentRowIndex === rowIndex && currentColumnIndex === columnIndex
            ? selectedTool.block
            : cell,
        ),
      )
      checkForRecipes(newGrid)
      return newGrid
    })
  }

  const saveGrid = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid))
    setStatusMessage('Saved!')
  }

  const loadGrid = () => {
    const savedGrid = localStorage.getItem(STORAGE_KEY)

    if (!savedGrid) {
      setStatusMessage('No saved grid found.')
      return
    }

    try {
      const parsedGrid = parseSavedGrid(savedGrid)

      if (!parsedGrid) {
        setStatusMessage('Saved grid is corrupt.')
        return
      }

      setGrid(parsedGrid)
      setStatusMessage('Loaded!')
    } catch {
      setStatusMessage('Saved grid is corrupt.')
    }
  }

  const resetGrid = () => {
    setGrid(createEmptyGrid())
    setStatusMessage('Reset!')
  }

  return (
    <main className="app-shell">
      <header className="builder-header">
        <h1>Mini Block Builder</h1>
        <p>Pick a block, then click cells to place it.</p>
      </header>

      <section className="toolbar" aria-label="Block toolbar">
        <div className="block-tool-row" aria-label="Block types">
          {blockTypes
            .filter((block) => !block.isDiscoverable || discoveredBlocks.has(block.id))
            .map((block) => {
              const isSelected =
                selectedTool.kind === 'block' && block.id === selectedTool.block.id

              return (
                <button
                  type="button"
                  className={`block-button ${isSelected ? 'selected' : ''}`}
                  key={block.id}
                  onClick={() => setSelectedTool({ kind: 'block', block })}
                  aria-pressed={isSelected}
                >
                  <span
                    className="block-swatch"
                    style={{ backgroundColor: block.color }}
                    aria-hidden="true"
                  />
                  {block.name}
                </button>
              )
            })}

          <button
            type="button"
            className={`block-button eraser-button ${
              selectedTool.kind === 'eraser' ? 'selected' : ''
            }`}
            onClick={() => setSelectedTool({ kind: 'eraser' })}
            aria-pressed={selectedTool.kind === 'eraser'}
          >
            <span className="eraser-icon" aria-hidden="true">
              x
            </span>
            Eraser
          </button>
        </div>

        <div className="action-row" aria-label="Grid actions">
          <button type="button" className="action-button" onClick={saveGrid}>
            Save
          </button>
          <button type="button" className="action-button" onClick={loadGrid}>
            Load
          </button>
          <button type="button" className="action-button" onClick={resetGrid}>
            Reset
          </button>
        </div>

        <p className="status-message" role="status" aria-live="polite">
          {statusMessage}
        </p>
      </section>

      <section
        className="world-grid"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLUMNS}, 32px)`,
        }}
        aria-label={`${GRID_COLUMNS} by ${GRID_ROWS} block grid`}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, columnIndex) => (
            <button
              type="button"
              className="grid-cell"
              key={`${rowIndex}-${columnIndex}`}
              onClick={() => updateCell(rowIndex, columnIndex)}
              style={{ backgroundColor: cell?.color }}
              aria-label={`Row ${rowIndex + 1}, column ${columnIndex + 1}${
                cell ? `, ${cell.name}` : ', empty'
              }`}
            />
          )),
        )}
      </section>
    </main>
  )
}

export default App
