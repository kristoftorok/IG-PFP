const userAgent = "Mozilla/5.0 (Linux; Android 10.1.0; motorola one Build/OPKS28.63-18-3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.80 Mobile Safari/537.36 Instagram 72.0.0.21.98 Android (27/8.1.0; 320dpi; 720x1362; motorola; motorola one; deen_sprout; qcom; pt_BR; 132081645)"

function getIgUsername(link) {
    return new Promise((resolve, reject) => {
        let regex = /(?<=instagram.com\/)[A-Za-z0-9_.]+/
        let username = link.match(regex)[0]
        resolve(username)
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

function getIgUserID(username) {
    return new Promise((resolve, reject) => {
        let url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`
        modifyHeaders(userAgent)

        fetch(url, {
                'mode': "no-cors"
            })
            .then(res => res.json())
            .then(out => resolve(out.data.user.id))
    })
}

function getCookies(domain, name, callback) {
    chrome.cookies.get({
        "url": domain,
        "name": name
    }, function (cookie) {
        if (callback) { callback(cookie.value); }
    });
}

function openIgAvt(instagram_user_id) {
    return new Promise((resolve, reject) => {
        modifyHeaders(userAgent)
        let url = `https://i.instagram.com/api/v1/users/${instagram_user_id}/info/`

        getCookies("https://www.instagram.com", "sessionid", function (sessionid) {
            fetch(url, {
                    headers:{
                        Cookie: "sessionid=" + sessionid
                    }
                })
                .then(res => res.json())
                .then(out => {
                    console.log(out)
                    let url = out.user.hd_profile_pic_url_info.url
                    chrome.tabs.create({url})
                    resolve(url)
                })
        });
    })
}

function getIgAvt(url) {
    getIgUsername(url).then(getIgUserID).then(openIgAvt)
}