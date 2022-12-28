// prevent loading ads in localhost
const development = window.location.host !== 'react-tooltip.com'
// use sandbox ads to test in localhost
const slotPathRightSidebarAdUnit = development
  ? '/6355419/Travel/Europe/France/Paris'
  : '/22862227500/desktop-sidebar-right'
const slotPathAnchorAdUnit = development ? '/6355419/Travel' : '/22862227500/desktop-sidebar-right'

window.reactTooltipAds = {
  initialized: {},
}

window.googletag = window.googletag || { cmd: [] }

window.googletag.cmd.push(function () {
  window.googletag
    .defineSlot(slotPathRightSidebarAdUnit, [300, 250], 'right-sidebar-ads')
    .addService(window.googletag.pubads())
  window.googletag.enableServices()
})

window.googletag.cmd.push(function () {
  window.googletag
    .defineOutOfPageSlot(slotPathAnchorAdUnit, window.googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR)
    .addService(window.googletag.pubads())
  window.googletag.enableServices()
})

const handleLoadAds = (event) => {
  const { id } = event.detail

  if (window.innerWidth < 1024 && !id.includes('anchor')) {
    return
  }

  window.googletag.cmd.push(function () {
    if (window.reactTooltipAds.initialized[id]) {
      window.googletag.cmd.push(function () {
        window.googletag.pubads().refresh()
      })

      window.googletag.display(id)
    } else {
      window.googletag.display(id)
      window.reactTooltipAds.initialized[id] = true
    }
  })
}

window.addEventListener('AdsContainerMounted', handleLoadAds)
