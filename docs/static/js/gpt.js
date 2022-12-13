window.onload = () => {
  ;(window.adsbygoogle = window.adsbygoogle || []).push({})
}

// window.reactTooltipAds = {
//   initialized: {},
// }
// window.googletag = window.googletag || { cmd: [] }

// window.googletag.cmd.push(function () {
//   window.googletag
//     .defineSlot('/6355419/Travel/Europe/France/Paris', [300, 250], 'right-sidebar-ads')
//     .addService(window.googletag.pubads())
//   window.googletag.enableServices()
// })

// const handleLoadAds = (event) => {
//   const { id } = event.detail

//   if (window.innerWidth < 1024) {
//     return
//   }

//   console.log('loading ads for container: ', id)
//   window.googletag.cmd.push(function () {
//     if (window.reactTooltipAds.initialized[id]) {
//       window.googletag.cmd.push(function () {
//         window.googletag.pubads().refresh()
//       })

//       window.googletag.display(id)
//     } else {
//       window.googletag.display(id)
//       window.reactTooltipAds.initialized[id] = true
//     }

//     console.log('displayed: ', id)
//   })
// }

// window.addEventListener('AdsContainerMounted', handleLoadAds)
