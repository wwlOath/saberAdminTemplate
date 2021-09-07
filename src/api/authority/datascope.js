import request from '@/router/axios';

export const getList = ( params) => {
  return request({
    url: '/api/blade-system/menu/lazy-menu-list',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getDatascopeList = (menuId, current, size, params) => {
  return request({
    url: '/api/blade-system/data-scope/list',
    method: 'get',
    params: {
      ...params,
      menuId,
      current,
      size
    }
  })
}

export const getTreeList = ( parentId) => {
  return request({
    url: '/api/blade-system/menu/lazy-menu-list',
    method: 'get',
    params: {
      parentId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-system/data-scope/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-system/data-scope/submit',
    method: 'post',
    data: row
  })
}

