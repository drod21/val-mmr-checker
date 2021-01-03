const axios = require('axios')
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();
const client_id = 'play-valorant-web-prod'
const nonce = 1
const redirect_uri = 'https://beta.playvalorant.com/opt_in'
const response_type = 'token id_token'
const scope = 'account openid'
const authorizeBody = { client_id, nonce, redirect_uri, scope, response_type }
const riotAuthUrl = 'https://auth.riotgames.com/api/v1/authorization'
const entitlementUrl = 'https://entitlements.auth.riotgames.com/api/token/v1'
const userInfoUrl = 'https://auth.riotgames.com/userinfo'
const buildRankedUrl = (userID) => `https://pd.ap.a.pvp.net/mmr/v1/players/${userID}/competitiveupdates?startIndex=0&endIndex=20`
const headers = { Authorization: '' }
let accessToken = ''
let entitlementToken = ''
let userId = ''

const getAuthenticationBody = (username, password) => ({ password, username, type: 'auth' })

const getAuthorization = async () => {
    await axios.post(riotAuthUrl, { ...authorizeBody }, { jar: cookieJar, withCredentials: true })
}

const authenticate = async () => {
  const jsonAuth = await axios.put(riotAuthUrl, { ...getAuthenticationBody('drod2169', '0813Britt!') }, { jar: cookieJar, withCredentials: true })
  accessToken = jsonAuth.data.response.parameters.uri.match("access_token=(.+?)&scope=")[1]
  headers.Authorization = `Bearer ${accessToken}`
  entitlementToken = await axios.post(entitlementUrl, {}, { jar: cookieJar, withCredentials: true, headers }).then((res) => res.data.entitlements_token)
  userId = await axios.post(userInfoUrl, {}, { jar: cookieJar, withCredentials: true, headers }).then((res) => res.data.sub)
  headers['X-Riot-Entitlements-JWT'] = entitlementToken
}

async function checkRankedUpdates() {
  const rankedRes = await axios.get(buildRankedUrl(userId), { headers })
  console.log(rankedRes.data)
}

getAuthorization().then(() => authenticate()).then(() => checkRankedUpdates())