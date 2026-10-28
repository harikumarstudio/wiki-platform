/**
 * @jest-environment jsdom
 */

import { init } from '../../modules/last-update'

const createPastDate = (passedSeconds) => {
  // Create a date N seconds ago and return it for subsequent checks.
  //
  // Subtract milliseconds instead of using setHours. The previous version
  // passed a fractional number of hours to setHours, which truncates it toward
  // zero: during the day, getHours() - 1.944 meant "minus two hours," but in
  // the first hour after midnight, 0 - 1.944 became -1, or one hour. This made
  // the test fail every day between midnight and 1 a.m.
  const date = new Date(Date.now() - passedSeconds * 1000)

  const time = document.createElement('time')
  time.setAttribute('data-relative-time', null)
  time.setAttribute('datetime', date.toISOString())

  if (document.body.hasChildNodes()) {
    document.body.firstChild.remove()
  }

  document.body.append(time)

  return time
}

describe('last-update', () => {
  it('formats elapsed time in seconds', () => {
    const date = createPastDate(30)
    init()
    expect(date.textContent).toMatch('30 seconds ago')
  })

  it('formats elapsed time in minutes', () => {
    const date = createPastDate(600)
    init()
    expect(date.textContent).toMatch('10 minutes ago')
  })

  it('formats elapsed time in hours and rounds up', () => {
    const date = createPastDate(7000)
    init()
    expect(date.textContent).toMatch('2 hours ago')
  })

  it('does not format elapsed time after one day', () => {
    const date = createPastDate(86400)
    init()
    expect(date.textContent).toMatch('')
  })
})
