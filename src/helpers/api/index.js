import axios from 'axios'
import { BASE } from '../urls'
import { Service } from 'axios-middleware'
import store from 'src/store'

const authHeader = () => {
  let user = JSON.parse(localStorage.getItem('user'))

  if (user && user.token) {
    return {
      Authorization: `Bearer ${user.token}`,
      'Access-Control-Allow-Origin': '*',
    }
  }
}

export const api = axios.create({
  baseURL: BASE,
  headers: authHeader(),
})

// Response Interceptor
api.interceptors.response.use(
  (resp) => resp.data, // Automatically extract data
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch({ type: 'LOG_OUT' })
    }
    return Promise.reject(error)
  },
)

// Request Interceptor
api.interceptors.request.use(
  (req) => {
    const state = store.getState()
    req.headers['x-access-token'] = req.headers['x-access-token'] || state.user?.token
    return req
  },
  (error) => Promise.reject(error),
)

// const service = new Service(api)

// service.register({
//   onResponse(resp) {
//     /* const {
//       data: { data },
//     } = resp; */
//     return resp
//   },
// })
