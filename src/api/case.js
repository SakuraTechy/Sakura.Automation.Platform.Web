import request from '@/utils/request'

// 获取所有数节点信息
export function getCaseNode(id) {
    return request({
      url: `/system/case/node/list/${id}`,
      method: 'get',
    })
}