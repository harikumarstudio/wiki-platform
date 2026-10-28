export function init() {
  const DAY_DURATION = 86400
  const time = document.querySelector('[data-relative-time]')

  if (!time) {
    return
  }

  function getPassedTime(postTime) {
    return Math.abs((new Date() - postTime) / 1000) // Calculate the time since publication in seconds.
  }

  function timeFormatter(passedTime) {
    const converter = [
      ['hour', 3600],
      ['minute', 60],
      ['second', 1],
    ]
    const timeTemplate = new Intl.RelativeTimeFormat('en', {
      localeMatcher: 'best fit',
      numeric: 'always',
      style: 'long',
    })
    const [unit, seconds] = converter.find(([, seconds]) => seconds <= passedTime)
    const convertedTime = Math.round(passedTime / seconds)

    return timeTemplate.format(-convertedTime, unit)
  }

  const postTime = new Date(time.dateTime)
  const passedTime = getPassedTime(postTime)

  if (passedTime < DAY_DURATION) {
    time.textContent = timeFormatter(passedTime) // Format elapsed time as a localized string.
  }
}

try {
  init()
} catch (error) {
  console.error(`Failed to calculate the time since publication: ${error}`)
}
