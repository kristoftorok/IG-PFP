chrome.contextMenus.create({
  title: 'Download Profile Picture',
  contexts: ['all'],
  onclick: () => {
    getTabUrl().then(url => {
      if (url.includes('instagram.com')) {
        getIgUserProfilePicture(url)
      } else {
        alert('Unsupported Website')
      }
    })
  },
  documentUrlPatterns: ['https://*.instagram.com/*']
})
