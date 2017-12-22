import jsonp from 'common/js/jsonp'
import { options, TEST, HTTPIP } from './config'
import { getSign, getDate } from './crypto'
import axios from 'axios'
export function getPublishList(token, listObj) {
  if (TEST) {
    return require('api/data/compareList.json')
  }
  let url = HTTPIP + '/v1/getPublishList'
  let objData = Object.assign({}, listObj, {
    accesstoken: token,
    timestamp: getDate()
  })
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}

export function houseUpload(token, upobj, type) {
  let url = ''
  switch (type) {
    case '1':
      url = HTTPIP + '/v1/warehouseUpload'
      break
    case '2':
      url = HTTPIP + '/v1/officeUpload'
      break
    case '3':
      url = HTTPIP + '/v1/storefrontUpload'
      break
    case '4':
      url = HTTPIP + '/v1/houseUpload'
      break
    default:
      break
  }
  let objData = Object.assign({}, upobj, {
    accesstoken: token,
    timestamp: getDate()
  })
  let sign = getSign(objData)
  objData.sign = sign
  objData.picAry = JSON.stringify(objData.picAry)
  objData.showtypeAry = JSON.stringify(objData.showtypeAry)
  if (objData.nearbyAry) {
    objData.nearbyAry = JSON.stringify(objData.nearbyAry)
  }
  // return axios({
  //   url: url,
  //   method: 'get',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   params: objData
  // }).then((res) => {
  //   return Promise.resolve(res.data)
  // })
  return jsonp(url, objData, options)
}

export function addBefore(token, upobj) {
  let url = HTTPIP + '/v1/addBefore'
  let objData = Object.assign({}, upobj, {
    accesstoken: token,
    timestamp: getDate()
  })
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}