// Get current tab URL
function getCurrentTabUrl() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({
                active: true,
                lastFocusedWindow: true
            },
            tabs => {
                var tab = tabs[0]
                var tab_url = tab.url
                resolve(tab_url)
            }
        )
    })
}
// Create context menu
chrome.contextMenus.create({
    title: 'Download Profile Picture',
    contexts: ['all'],
    onclick: () => {
        getCurrentTabUrl().then(url => {
            // facebook
            if (url.includes('instagram.com')) {
                getIgAvt(url)
            }
        })
    },
    documentUrlPatterns: ['*://*.instagram.com/*']
})