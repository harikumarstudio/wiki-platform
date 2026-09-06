const { titleFormatter } = require('../title-formatter/title-formatter')

describe('titleFormatter', () => {
  it('склеивает части длинным тире', () => {
    expect(titleFormatter(['display', 'CSS', 'Wiki'])).toBe('display — CSS — Wiki')
  })

  it('выбрасывает пустые части', () => {
    expect(titleFormatter(['display', undefined, 'Wiki'])).toBe('display — Wiki')
    expect(titleFormatter(['display', '', null, 'Wiki'])).toBe('display — Wiki')
  })

  it('возвращает единственную часть без разделителя', () => {
    expect(titleFormatter(['Wiki'])).toBe('Wiki')
  })

  it('возвращает пустую строку, когда частей нет', () => {
    expect(titleFormatter([])).toBe('')
    expect(titleFormatter([null, undefined, ''])).toBe('')
  })
})
