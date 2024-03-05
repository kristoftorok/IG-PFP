function getIgUserProfilePicture(url) {
  getIgUsername(url).then(getIgUserId).then(openIgUserPicture)
}

const userAgent = "Mozilla/5.0 (Linux; Android 13; ONEPLUS A6013 AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/112.0.5615.48 Mobile Safari/537.36 Instagram 317.0.0.34.109 Android (33/13; 450dpi; 1080x2126; OnePlus; ONEPLUS A6013; OnePlus6T; qcom; en_US; 563459856)"

function getTabUrl() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      {
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

function getIgUsername(link) {
  return new Promise((resolve, reject) => {
      let regex = /(?<=instagram.com\/)[A-Za-z0-9_.]+/
      let username = link.match(regex)[0]
      resolve(username)
  })
}

function getIgUserId(username) {
  return new Promise((resolve, reject) => {
    let url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`
    modifyHeaders(userAgent)

    fetch(url)
      .then(res => res.json())
      .then(out => resolve(out.data.user.id))
  })
}

function modifyHeaders(headerStr) {
  chrome.webRequest.onBeforeSendHeaders.addListener(
      function (details) {
          for (var header of details.requestHeaders) {
              if (header.name.toLowerCase() === 'user-agent') {
                  header.value = headerStr
              }
          }
          return {
              requestHeaders: details.requestHeaders
          }
      }, {
          urls: ['https://i.instagram.com/api/v1/users/*']
      },
      ['blocking', 'requestHeaders']
  )
}

function openIgUserPicture(instagram_user_id) {
  return new Promise((resolve, reject) => {
    modifyHeaders(userAgent)
    let url = `https://i.instagram.com/api/v1/users/${instagram_user_id}/info/`

    fetch(url)
      .then(res => res.json())
      .then(out => {
        console.log(out)
        let url = out.user.hd_profile_pic_url_info.url
        chrome.tabs.create({ url })
        resolve(url)
      })
  })
}
