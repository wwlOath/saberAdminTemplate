import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/dict-biz/parent-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getSettingList = (parentId, params) => {
  return request({
    url: '/api/blade-system/dict-biz/child-list',
    method: 'get',
    params: {
      ...params,
      parentId,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-system/dict-biz/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-system/dict-biz/submit',
    method: 'post',
    data: row
  })
}

