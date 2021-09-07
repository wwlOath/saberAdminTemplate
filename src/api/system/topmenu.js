import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/topmenu/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const remove = (ids) => {
  return request({
    url: '/api/blade-system/topmenu/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-system/topmenu/submit',
    method: 'post',
    data: row
  })
}

export const getTopTree = () => {
  return request({
    url: '/api/blade-system/menu/grant-top-tree',
    method: 'get',
    params: {}
  })
}

export const getTopTreeKeys = (topMenuIds) => {
  return request({
    url: '/api/blade-system/menu/top-tree-keys',
    method: 'get',
    params: {
      topMenuIds
    }
  })
}

export const getGrant = (row) => {
  return request({
    url: '/api/blade-system/topmenu/grant',
    method: 'post',
    data: row
  })
}
