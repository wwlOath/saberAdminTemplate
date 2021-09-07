import request from '@/router/axios';

export const getOssList = (current, size, params) => {
  return request({
    url: '/api/blade-resource/oss/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getAttachList = (current, size, params) => {
  return request({
    url: '/api/blade-resource/attach/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getSmsList = (current, size, params) => {
  return request({
    url: '/api/blade-resource/sms/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const ossSubmit = (params) => {
  return request({
    url: '/api/blade-resource/oss/submit',
    method: 'post',
    data: params
  })
}

export const smsSubmit = (params) => {
  return request({
    url: '/api/blade-resource/sms/submit',
    method: 'post',
    data: params
  })
}

export const ossRemove = (ids) => {
  return request({
    url: 'api/blade-resource/oss/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const attachRemove = (ids) => {
  return request({
    url: 'api/blade-resource/attach/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const smsRemove = (ids) => {
  return request({
    url: 'api/blade-resource/sms/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const smsSend = (params) => {
  return request({
    url: '/api/blade-resource/sms/endpoint/send-message',
    method: 'post',
    params: {...params}
  })
}

export const smsEnabled = (id) => {
  return request({
    url: '/api/blade-resource/sms/enable',
    method: 'post',
    params: {
      id
    }
  })
}
