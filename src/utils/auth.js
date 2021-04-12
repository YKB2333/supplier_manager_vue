import Cookies from 'js-cookie'
import { cookieExpires, projectKey } from '@/config'

export function getToken() {
  return Cookies.get(`${projectKey}Admin-Token`)
}

export function setToken(token) {
  Cookies.set(`${projectKey}Admin-Token`, token, { expires: cookieExpires })
}