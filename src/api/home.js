import jsonp from 'common/js/jsonp'
import { commonParams, options, TEST, HTTPIP } from './config'
import { getSign, getDate } from './crypto'
import axios from 'axios'

export function getHomeList(token, listObj) {
  if (TEST) {
    return require('api/data/homeList.json')
  }
  let url = HTTPIP + '/v1/getHomeList'
  let objData = Object.assign({}, listObj, {
    accesstoken: token,
    timestamp: getDate()
  })
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}
export function getHomeSearch(token, listObj, type) {
  let url = ''
  switch (type) {
    case '1':
      url = HTTPIP + '/v1/warehouseSearch'
      break
    case '2':
      url = HTTPIP + '/v1/officeSearch'
      break
    case '3':
      url = HTTPIP + '/v1/StorefrontSearch'
      break
    case '4':
      url = HTTPIP + '/v1/HouseSearch'
      break
    default:
      break
  }
  let objData = Object.assign({}, listObj, {
    accesstoken: token,
    timestamp: getDate()
  })
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}
export function getSearchCondition(token, city) {
  let url = HTTPIP + '/v1/getSearchCondition'
  let objData = {
    accesstoken: token,
    cityid: city,
    timestamp: getDate()
  }
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}
export function getCityList(token) {
  let url = HTTPIP + '/v1/getCityList'
  let objData = {
    accesstoken: token,
    timestamp: getDate()
  }
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}

export function getHomeDetial(token, id, type) {
  if (TEST) {
    if (id !== '1') {
      return require('api/data/bangonglou.json')
    }
    return require('api/data/changfang.json')
  }
  let url = ''
  switch (type) {
    case '1':
      url = HTTPIP + '/v1/getWarehouseDetail'
      break
    case '2':
      url = HTTPIP + '/v1/getOfficeDetail'
      break
    case '3':
      url = HTTPIP + '/v1/getStorefrontDetail'
      break
    case '4':
      url = HTTPIP + '/v1/getHouseDetail'
      break
    default:
      break
  }
  let objData = {
    accesstoken: token,
    houseid: id,
    timestamp: getDate()
  }
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}

export function getSearchList() {
  return require('api/data/search_type.json')
}

export function getPubliList() {
  return require('api/data/publish_type.json')
}

export function getDiscList() {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getAreaList(token, cityid) {
  let url = HTTPIP + '/v1/getAreaList'
  let objData = {
    accesstoken: token,
    cityid: cityid,
    timestamp: getDate()
  }
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}

export function getAdverts(token) {
  let url = HTTPIP + '/v1/getAdverts'
  let objData = {
    accesstoken: token,
    timestamp: getDate()
  }
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}

export function getCityWithLng(token, obj) {
  let url = HTTPIP + '/v1/getCityWithLng'
  let objData = Object.assign({}, obj, {
    accesstoken: token,
    timestamp: getDate()
  })
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}