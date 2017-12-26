import jsonp from 'common/js/jsonp'
import { options, TEST, HTTPIP } from './config'
import { getSign, getDate } from './crypto'
import axios from 'axios'

export function userInfo(token) {
  let url = HTTPIP + '/v1/userInfo'
  let objData = {
    accesstoken: token,
    timestamp: getDate()
  }
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}

export function modifyUserInfo(token, userobj) {
  let url = HTTPIP + '/v1/ModifyUserInfo'
  let objData = Object.assign({}, userobj, {
    accesstoken: token,
    timestamp: getDate()
  })
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}

export function getOrderList(token, orderType) {
  let url = HTTPIP + '/v1/userInfo'
  let objData = {
    accesstoken: token,
    ordertype: orderType,
    timestamp: getDate()
  }
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}

export function collectList(token) {
  let url = HTTPIP + '/v1/collectList'
  let objData = {
    accesstoken: token,
    timestamp: getDate()
  }
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}

export function collectOperation(token, id, collected) {
  let url = HTTPIP + '/v1/collectOperation'
  let objData = {
    accesstoken: token,
    houseid: id,
    collecttype: collected,
    timestamp: getDate()
  }
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}

export function getAccountMoney(token) {
  let url = HTTPIP + '/v1/getAccountMoney'
  let objData = {
    accesstoken: token,
    timestamp: getDate()
  }
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}

export function adviceCommit(token, content) {
  let url = HTTPIP + '/v1/adviceCommit'
  let objData = {
    accesstoken: token,
    content: content,
    timestamp: getDate()
  }
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}

export function payForRent(token, amount) {
  let url = HTTPIP + '/pay/order/create'
  let objData = {
    accesstoken: token,
    amount: amount,
    timestamp: getDate()
  }
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}

export function refund(token) {
  let url = HTTPIP + '/pay/refund'
  let objData = {
    accesstoken: token,
    timestamp: getDate()
  }
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}

export function uploadImg(token, file) {
  const url = HTTPIP + '/v1/uploadImg'
  return axios({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: file
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取押金
export function managerCashGet() {
  let url = HTTPIP + '/v1/managerCashGet'

  let objData = {
    timestamp: getDate()
  }
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}