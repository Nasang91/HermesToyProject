import { useState } from 'react'
import './App.css'

type BlockType = {
  id: string
  name: string
  color: string
}

const GRID_COLUMNS = 20
const GRID_ROWS = 15

const blockTypes: BlockType[] = [
  { id: 'grass', name: 'Grass', color: '#4caf50' },
  { id: 'stone', name: 'Stone', color: '#8e8e8e' },
  { id: 'dirt', name: 'Dirt', color: '#8b5a2b' },
]

// Start every cell empty; each position later stores the placed block type.
const createEmptyGrid = () =>
  Array.from({ length: GRID_ROWS }, () =>
    Array.from<BlockType | null>({ length: GRID_COLUMNS }).fill(null),
  )

function App() {
  const [selectedBlock, setSelectedBlock] = useState<BlockType>(blockTypes[0])
  const [grid, setGrid] = useState(createEmptyGrid)

  const placeBlock = (rowIndex: number, columnIndex: number) => {
    // Build a new grid so React can detect and render the changed cell.
    setGrid((currentGrid) =>
      currentGrid.map((row, currentRowIndex) =>
        row.map((cell, currentColumnIndex) =>
          currentRowIndex === rowIndex && currentColumnIndex === columnIndex
            ? selectedBlock
            : cell,
        ),
      ),
    )
  }

  return (
    <main className="app-shell">
      <header className="builder-header">
        <h1>Mini Block Builder</h1>
        <p>Pick a block, then click cells to place it.</p>
      </header>

      <section className="toolbar" aria-label="Block toolbar">
        {blockTypes.map((block) => {
          const isSelected = block.id === selectedBlock.id

          return (
            <button
              type="button"
              className={`block-button ${isSelected ? 'selected' : ''}`}
              key={block.id}
              onClick={() => setSelectedBlock(block)}
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
              onClick={() => placeBlock(rowIndex, columnIndex)}
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
