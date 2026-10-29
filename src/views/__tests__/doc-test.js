const { eleventyComputed } = require('../doc.11tydata')

describe('doc hasUpdatedAt', () => {
  it('returns false when only the creation date is available', () => {
    expect(eleventyComputed.hasUpdatedAt({ createdAt: new Date('2026-10-28'), updatedAt: null })).toBe(false)
  })

  it('returns false when the creation and update dates are equal', () => {
    expect(
      eleventyComputed.hasUpdatedAt({
        createdAt: new Date('2026-10-28T10:00:00Z'),
        updatedAt: new Date('2026-10-28T10:00:00Z'),
      }),
    ).toBe(false)
  })

  it('returns true when the update date differs from the creation date', () => {
    expect(
      eleventyComputed.hasUpdatedAt({
        createdAt: new Date('2026-10-28T10:00:00Z'),
        updatedAt: new Date('2026-10-29T10:00:00Z'),
      }),
    ).toBe(true)
  })

  it('returns true when only the update date is available', () => {
    expect(eleventyComputed.hasUpdatedAt({ createdAt: null, updatedAt: new Date('2026-10-29') })).toBe(true)
  })
})
