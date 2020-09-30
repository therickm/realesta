import request from '@/utils/request';
import { login, details } from '../../db/actions';

export async function accountLogin(params) {
  console.log('here',params);
  return await login(params)
}
export async function getPermissions(id) {
  return await details(id)
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
