/*
 * @Author: 刘智 liuzhi@sakura.com
 * @Date: 2022-07-18 15:45:13
 * @LastEditors: 刘智 liuzhi@sakura.com
 * @LastEditTime: 2022-11-30 14:14:35
 * @FilePath: \Sakura.Test.Platform.Web\src\api\monitor\online.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

// 查询在线用户列表
export function list (query) {
  return request({
    url: '/monitor/online/list',
    method: 'get',
    params: query
  })
}

// 强退用户
export function forceLogout (tokenId) {
  return request({
    url: '/monitor/online/' + tokenId,
    method: 'delete'
  })
}
