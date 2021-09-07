import request from '@/router/axios';

export const iframeUrl = 'https://saber.bladex.vip/api/blade-flow/process/resource-view?processDefinitionId=';
export const iframeDiagramUrl = 'https://saber.bladex.vip/api/blade-flow/process/diagram-view?processInstanceId=';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/work/start-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getClaimList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/work/claim-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getTodoList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/work/todo-list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const getSendList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/work/send-list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const getDoneList = (current, size, params) => {
  return request({
    url: '/api/blade-flow/work/done-list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

export const getTodoHistory = (params) => {
  return request({
    url: '/api/blade-flow/process/history-flow-list',
    method: 'get',
    params: {
      processInstanceId: params,
    }
  })
}

export const todoSumit = (row) => {
  return request({
    url: '/api/blade-flow/work/complete-task',
    method: 'post',
    data: row
  })
}

export const getTodoDetail = (params) => {
  return request({
    url: '/api/blade-desk/process/leave/detail',
    method: 'get',
    params: {
      businessId: params,
    }
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-flow/work/submit',
    method: 'post',
    data: row
  })
}

export const leaveSubmit = (row) => {
  return request({
    url: '/api/blade-desk/process/leave/start-process',
    method: 'post',
    data: row
  })
}
