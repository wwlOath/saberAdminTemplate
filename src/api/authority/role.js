import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/role/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getRoleTree = (tenantId) => {
  return request({
    url: '/api/blade-system/role/tree-by-id',
    method: 'get',
    params: {
      tenantId,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-system/role/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-system/role/submit',
    method: 'post',
    data: row
  })
}

export const getGrantTree = () => {
  return request({
    url: '/api/blade-system/menu/grant-tree',
    method: 'get',
    params: {}
  })
}

export const getRoleTreeKeys = (roleIds) => {
  return request({
    url: '/api/blade-system/menu/role-tree-keys',
    method: 'get',
    params: {
      roleIds
    }
  })
}

export const getGrant = (row) => {
  return request({
    url: '/api/blade-system/role/grant',
    method: 'post',
    data: row
  })
}

