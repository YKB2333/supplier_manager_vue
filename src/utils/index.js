export function formatDate(number, format) { // formatDate('Y/M/D h:m:s')
  number = Number(number)
  let formatNumber = (n) => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
  var returnArr = []

  var date = new Date(number)
  returnArr.push(date.getFullYear())
  returnArr.push(formatNumber(date.getMonth() + 1))
  returnArr.push(formatNumber(date.getDate()))

  returnArr.push(formatNumber(date.getHours()))
  returnArr.push(formatNumber(date.getMinutes()))
  returnArr.push(formatNumber(date.getSeconds()))

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i])
  }
  return format
}

export function uniqueArrByKey(arr, key) {
  let obj = {}
  let result = []
  result = arr.reduce((cur, next) => {
    obj[next[key]] ? '' : obj[next[key]] = true && cur.push(next)
    return cur
  }, [])
  return result
}

export function listToTree(list, key, superKey) {
  let map = {};
  list.forEach(item => {
    item.id = Number(item.id)
    item[superKey] = Number(item[superKey])
    if (!map[item[key]]) {
      map[item[key]] = item
    }
  });
  list.forEach(item => {
    if (item[superKey] !== 0 && map[item[superKey]]) {
      if (map[item[superKey]].children) {
        map[item[superKey]].children.push(item);
      } else {
        map[item[superKey]]["children"] = [item];
      }
    }
  });
  return list.filter(item => {
    if (item[superKey] === 0) {
      return item;
    }
  });
}

export function isEmpty(obj) {
  if (Array.isArray(obj) && obj.length == 0) {
    return true
  } else if (typeof obj == 'undefined' || obj == null || obj == '') {
    return true
  } else {
    return false
  }
}

export function getUrlParam(url, key) {
  return decodeURIComponent((new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null
}

export function checkEmail(email) {
  let reg = /^([a-zA-Z0-9]+[_|\_|-|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|-|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
  return reg.test(email)
}

export function checkMobile(mobile) { // 1开头，11位
  let reg = /^1\d{10}$/
  return reg.test(mobile)
}

export function formatFileSize(fileSize) {
  if (fileSize < 1024) {
    return fileSize + 'B';
  } else if (fileSize < (1024 * 1024)) {
    var temp = fileSize / 1024;
    temp = temp.toFixed(2);
    return temp + 'KB';
  } else if (fileSize < (1024 * 1024 * 1024)) {
    var temp = fileSize / (1024 * 1024);
    temp = temp.toFixed(2);
    return temp + 'MB';
  } else {
    var temp = fileSize / (1024 * 1024 * 1024);
    temp = temp.toFixed(2);
    return temp + 'GB';
  }
}

export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function getMaxNumber() {
  return 2147483647
}

export const copyContent = (content) => {
  let input = document.createElement("input")   // 直接构建input
  input.value = content  // 设置内容
  document.body.appendChild(input)    // 添加临时实例
  input.select()   // 选择实例内容
  document.execCommand("Copy")   // 执行复制
  document.body.removeChild(input) // 删除临时实例
}