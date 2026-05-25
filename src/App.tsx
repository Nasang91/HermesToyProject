import { useEffect, useState } from 'react'
import './App.css'

type BlockId = 'grass' | 'stone' | 'dirt' | 'sand' | 'wood' | 'water'

type BlockType = {
  id: BlockId
  name: string
  color: string
}

type GridCell = BlockType | null
type Grid = GridCell[][]
type SelectedTool =
  | { kind: 'block'; block: BlockType }
  | { kind: 'eraser' }

const GRID_COLUMNS = 20
const GRID_ROWS = 15
const STORAGE_KEY = 'miniBlockBuilder_grid'

const blockTypes: BlockType[] = [
  { id: 'grass', name: 'Grass', color: '#4caf50' },
  { id: 'stone', name: 'Stone', color: '#8e8e8e' },
  { id: 'dirt', name: 'Dirt', color: '#8b5a2b' },
  { id: 'sand', name: 'Sand', color: '#f4c542' },
  { id: 'wood', name: 'Wood', color: '#8B4513' },
  { id: 'water', name: 'Water', color: '#1E90FF' },
]

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

  useEffect(() => {
    if (!statusMessage) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setStatusMessage('')
    }, 2000)

    return () => window.clearTimeout(timeoutId)
  }, [statusMessage])

  const updateCell = (rowIndex: number, columnIndex: number) => {
    // Build a new grid so React can detect and render the changed cell.
    setGrid((currentGrid) =>
      currentGrid.map((row, currentRowIndex) =>
        row.map((cell, currentColumnIndex) =>
          currentRowIndex === rowIndex && currentColumnIndex === columnIndex
            ? selectedTool.kind === 'block'
              ? selectedTool.block
              : null
            : cell,
        ),
      ),
    )
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
          {blockTypes.map((block) => {
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
