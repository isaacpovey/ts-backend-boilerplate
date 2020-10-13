import * as http from 'http'
import * as https from 'https'
import axios from 'axios'

const httpAgent = new http.Agent({ keepAlive: true })
const httpsAgent = new https.Agent({ keepAlive: true })

export const axiosInstance = axios.create({
  httpAgent,
  httpsAgent,
  timeout: 10000
})
