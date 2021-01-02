const axios = require('axios')
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();
const client_id = 'play-valorant-web-prod'
const nonce = '1'
const redirect_uri = 'https://beta.playvalorant.com/opt_in'
const response_type = 'token id_token'
const scope = 'account openid'
const authorizeBody = { client_id, nonce, redirect_uri, scope, response_type }
const riotAuthUrl = 'https://auth.riotgames.com/api/v1/authorization'
let accessToken = ''
const headers = { Authorization: '' }

const getAuthenticationBody = (username, password) => ({ password, username, type: 'auth' })

const getAuthorization = async () => {
    await axios.post(riotAuthUrl, { ...authorizeBody }, { jar: cookieJar, withCredentials: true })
}

const authenticate = async () => {
  await getAuthorization()
  
  const jsonAuth = await axios.put(riotAuthUrl, { ...getAuthenticationBody('drod2169', '0813Britt!') }, { jar: cookieJar, withCredentials: true })
  accessToken = jsonAuth.data.response.parameters.uri.match("access_token=(.+?)&scope=")[1]
  headers.Authorization = `Bearer ${accessToken}`
}

authenticate()