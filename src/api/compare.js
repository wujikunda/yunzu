import jsonp from 'common/js/jsonp'
import { options, TEST, HTTPIP } from './config'
import { getSign, getDate } from './crypto'
import axios from 'axios'

export function getCompareList(token, listObj) {
  if (TEST) {
    return require('api/data/compareList.json')
  }
  let url = HTTPIP + '/v1/getComparisonList'
  let objData = Object.assign({}, listObj, {
    accesstoken: token,
    timestamp: getDate()
  })
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}

export function addComparison(token, id, type) {
  let url = HTTPIP + '/v1/addComparison'
  if (type === 1) {
    url = HTTPIP + '/v1/delComparison'
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

export function getCompareCont(token, idone, idtwo) {
  if (TEST) {
    return require('api/data/compareContent.json')
  }
  let url = HTTPIP + '/v1/getComparisonResult'
  let objData = {
    accesstoken: token,
    houseidone: idone,
    houseidtwo: idtwo,
    timestamp: getDate()
  }
  let sign = getSign(objData)
  objData.sign = sign
  return jsonp(url, objData, options)
}