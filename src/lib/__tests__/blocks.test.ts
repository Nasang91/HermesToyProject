import { describe, expect, it } from 'vitest'
import { blockTypes, findCombinationResult } from '../blocks'

describe('block combinations', () => {
  it('combines grass + water into moss in both orders', () => {
    expect(findCombinationResult('grass', 'water')).toBe('moss')
    expect(findCombinationResult('water', 'grass')).toBe('moss')
  })

  it('registers moss as discoverable', () => {
    const moss = blockTypes.find((block) => block.id === 'moss')

    expect(moss).toBeDefined()
    expect(moss?.isDiscoverable).toBe(true)
  })
})
