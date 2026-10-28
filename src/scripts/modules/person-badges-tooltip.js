// Listen for tooltip events.
function initTooltip(tooltipContainer) {
  const trigger = tooltipContainer.querySelector('.person-badges__default-image')
  const tooltip = tooltipContainer.querySelector('.person-badges__pop-up-container')

  // Show the tooltip on hover and focus.
  tooltipContainer.addEventListener('mouseenter', () => {
    showTooltip(tooltip)
  })
  trigger.addEventListener('focus', () => {
    showTooltip(tooltip)
  })

  // Hide the tooltip when the pointer leaves the badge and focus moves elsewhere.
  tooltipContainer.addEventListener('mouseleave', () => {
    hideTooltip(tooltip)
  })
  trigger.addEventListener('blur', () => {
    hideTooltip(tooltip)
  })

  // Hide the tooltip when Escape is pressed.
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideTooltip(tooltip)
    }
  })
}

function showTooltip(tooltip) {
  tooltip.style.display = 'grid'
}

function hideTooltip(tooltip) {
  tooltip.style.display = 'none'
}

window.addEventListener('load', () => {
  // Call the function.
  const tooltips = document.querySelectorAll('.person-badges__sign')

  tooltips.forEach((tooltip) => {
    initTooltip(tooltip)
  })
})
