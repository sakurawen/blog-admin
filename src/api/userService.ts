import { request } from '@/utils/'
import { ServiceResponse } from '@/@types'

/**
 * 用户登录
 * @param loginForm 
 * @returns 
 */
export const Login = (loginForm: {
  account: string,
  pwd: string
}) => {
  return request.post<any, ServiceResponse>("/user/login", loginForm)
}

/**
 * 验证jwt、自动登录
 */
export const validateJWT = () => {
  return request.post<any, ServiceResponse>("/user/verify")
}

/**
 * 测试错误
 * @returns 
 */
export const error = () => {
  return request.get("/error")
}
