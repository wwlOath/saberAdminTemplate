import request from '@/router/axios';
export const iframeDiagramUrl = 'https://saber.bladex.vip/api/blade-flow/process/resource-view?processDefinitionId=';

export const getModelList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/model/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getManagerList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/manager/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getFollowList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/follow/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const modelSubmit = (params) => {
  return request({
    url: '/api/blade-flow/model/deploy',
    method: 'post',
    params: {...params}
  })
}

export const managerSubmit = (params) => {
  return request({
    url: '/api/blade-flow/manager/change-state',
    method: 'post',
    params: {...params}
  })
}

export const modelRemove = (ids) => {
  return request({
    url: '/api/blade-flow/model/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const managerRemove = (deploymentId) => {
  return request({
    url: '/api/blade-flow/manager/delete-deployment',
    method: 'post',
    params: {
      deploymentId
    }
  })
}

export const followRemove = (deleteReason,processInstanceId) => {
  return request({
    url: '/api/blade-flow/follow/delete-process-instance',
    method: 'post',
    params: {
      deleteReason,
      processInstanceId
    }
  })
}
