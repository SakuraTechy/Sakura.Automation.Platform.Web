/**
 * 通用js方法封装处理
 * Copyright (c) 2019 sakura
 */

import log from "./log"

const baseURL = process.env.VUE_APP_BASE_API

// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/')
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

// 毫秒转时分秒，例如： 378230毫秒==>1时4分钟33秒
export function formatDuration(milliseconds) {
  // 将毫秒转换为秒
  const seconds = Math.floor(parseInt(milliseconds, 10) / 1000);
  
  // 分离出小时、分钟和秒数
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const remainingSecondsAfterMinutes = remainingSeconds % 60;

  // 根据是否超过一小时，选择不同的格式化方式
  let formattedDuration;
  if (minutes === 0) {
    formattedDuration = `${remainingSecondsAfterMinutes}秒`;
  } else if (hours === 0) {
      formattedDuration = `${minutes}分${remainingSecondsAfterMinutes}秒`;
  } else {
      formattedDuration = `${hours}时${minutes}分${remainingSecondsAfterMinutes}秒`;
  }
  // console.log(remainingSecondsAfterMinutes);
  return !isNaN(remainingSecondsAfterMinutes)?formattedDuration:'-';
}

export function getWeekStartAndEnd() {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  const endOfWeek = new Date(currentDate);

  // 设置本周开始时间为周日的下一天（即周一）0点
  startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() || 7) + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  // 设置本周结束时间为周六的后一天（即周日）23点59分59秒
  endOfWeek.setDate(endOfWeek.getDate() + (7 - (endOfWeek.getDay() || 7)));
  endOfWeek.setHours(23, 59, 59, 999);

  return {
    weekStart: formatDate(startOfWeek),
    weekEnd: formatDate(endOfWeek)
  };

  function formatDate(date) {
    return date.getFullYear() + '-' +
           ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
           ('0' + date.getDate()).slice(-2) + ' ' +
           ('0' + date.getHours()).slice(-2) + ':' +
           ('0' + date.getMinutes()).slice(-2) + ':' +
           ('0' + date.getSeconds()).slice(-2);
  }
}

// 获取本周开始和结束时间
export function getWeekStartAndEnd1() {
  const currentDate = new Date()
  const startOfWeek = new Date(currentDate)
  const endOfWeek = new Date(currentDate)

  // 设置本周开始时间为周一0点
  startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() || 7) + 1)
  startOfWeek.setHours(0, 0, 0, 0)

  // 设置本周结束时间为周日23点59分59秒
  endOfWeek.setDate(endOfWeek.getDate() + (6 - (endOfWeek.getDay() || 7)))
  endOfWeek.setHours(23, 59, 59, 999)
  return {
    weekStart: startOfWeek.toISOString().slice(0, 19).replace('T', ' '),
    weekEnd: endOfWeek.toISOString().slice(0, 19).replace('T', ' '),
  }
}

// 表单重置
export function resetForm(refName) {
  if (this[refName]) {
    this[refName].resetFields()
  }
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
  var search = params
  search.params = {}
  if (dateRange !== null && dateRange !== '' && dateRange.length === 2) {
    if (typeof propName === 'undefined') {
      search.params['beginTime'] = dateRange[0]
      search.params['endTime'] = dateRange[1]
    } else {
      search.params[propName + 'BeginTime'] = dateRange[0]
      search.params[propName + 'EndTime'] = dateRange[1]
    }
  }
  return search
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions = []
  Object.keys(datas).some((key) => {
    if (datas[key].dictValue === '' + value) {
      actions.push(datas[key].dictLabel)
      return true
    }
  })
  return actions.join('')
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
  var actions = []
  var currentSeparator = undefined === separator ? ',' : separator
  var temp = value.split(currentSeparator)
  Object.keys(value.split(currentSeparator)).some((val) => {
    Object.keys(datas).some((key) => {
      if (datas[key].dictValue === '' + temp[val]) {
        actions.push(datas[key].dictLabel + currentSeparator)
      }
    })
  })
  return actions.join('').substring(0, actions.join('').length - 1)
}

// 通用下载方法
export function download(fileName, delFlag) {
  if (delFlag === undefined) {
    delFlag = true
  }
  window.location.href = baseURL + '/common/download?fileName=' + encodeURI(fileName) + '&delete=' + delFlag
}
// 通用下载方法
export function downloadByPath(filePath, delFlag) {
  if (delFlag === undefined) {
    delFlag = true
  }
  window.location.href = baseURL + '/common/downloadByPath?filePath=' + encodeURI(filePath) + '&delete=' + delFlag
}
// 通用下载到导出任务中心
export function downloadTask() {
  this.$router.push({
    name: 'SysDownloadFiles',
    params: {
      key: new Date().toLocaleString(),
    },
  })
}

// 字符串格式化(%s )
export function sprintf(str) {
  var args = arguments
  var flag = true
  var i = 1
  str = str.replace(/%s/g, function () {
    var arg = args[i++]
    if (typeof arg === 'undefined') {
      flag = false
      return ''
    }
    return arg
  })
  return flag ? str : ''
}

// 转换字符串，undefined,null等转化为''
export function praseStrEmpty(str) {
  if (!str || str === 'undefined' || str === 'null') {
    return ''
  }
  return str
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || '0'
  // 对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  // 循环所有项
  const treeData = cloneData.filter((father) => {
    var branchArr = cloneData.filter((child) => {
      // 返回每一项的子级数组
      return father[id] === child[parentId]
    })

    if (branchArr.length > 0) {
      father.children = branchArr
    } else {
      father.children = ''
    }
    // 返回第一层
    return father[parentId] === rootId
  })
  return treeData !== '' && treeData == null ? treeData : data
}
/**
 * 从树中移除指定节点
 * @param {Object} list
 * @param {Object} node
 */
export function removeTreeNode(list, node) {
  const parentList = list
  const parentIds = node.parentIds.split('/')
  const currentNodeId = node.id
  deleteTreeNode(parentList, list, parentIds, currentNodeId)
}
export function deleteTreeNode(parentList, list, parentIds, currentNodeId) {
  for (let s = 0; s < list.length; s++) {
    if (list[s].id === currentNodeId) {
      list.splice(s, 1)
      // 当删除节点后，没有子节点时需要修改父节点为叶子节点
      if (list.length === 0) {
        parentList.treeLeaf = 'y'
      }
      return
    } else if (list[s].children && list[s].children.length > 0) {
      // 递归条件
      parentIds.splice(0, 1)
      deleteTreeNode(list[s], list[s].children, parentIds, currentNodeId)
    } else {
      continue
    }
  }
}
export function appendTreeNode(node, data) {
  if (node.treeLeaf === 'y') {
    // 如果节点是叶子节点则直接改为非叶子节点
    node.treeLeaf = 'n'
    node.children.push(data)
  } else {
    const children = node.children
    if (children.length > 0) {
      // 有子节点则直接push数据，否则不做操作等待异步加载
      node.children.push(data)
    }
  }
}
/**
 * 按展开几层展开树
 * @param {Object} nodes
 * @param {Object} expandLevel
 * @param {Object} expandedRowKeys 记录展开key
 */
export function expandTree(nodes, expandLevel, expandedRowKeys) {
  if (expandLevel > 1) {
    // 最后一层不展开
    nodes.forEach((node) => {
      expandedRowKeys.push(node.id)
      expandLevel = expandLevel - 1
      return expandTree(node.children, expandLevel, expandedRowKeys)
    })
  }
}
// 传入参数：需要遍历的数组，需要匹配的id,所需结果的key 递归找寻多层数组里面的元素
export function findNodeId(data, id, property) {
  // 设置结果
  let result
  if (!data) {
    return // 如果data传空，直接返回
  }
  data.forEach((item, index) => {
    if (item.id === id) {
      result = item[property]
    } else if (item.children && item.children.length > 0) {
      if (!result) {
        result = findNodeId(item.children, id, property)
      } else {
        return result
      }
    }
  })
  return result
}
// const jsonArray = [
//   {
//     "id": "a115ae2a989a4bb4afd648fade36cdf1",
//     "name": "数据库安全审计系统",
//     "paramsName": "VM_Name",
//     "paramsValue": "sakura@vsphere.local"
//   },
//   {
//     "id": "a115ae2a989a4bb4afd648fade36cdf2",
//     "name": "数据库安全审计系统1",
//     "paramsName": "VM_PassWord",
//     "paramsValue": "3edc$RFV"
//   }
// ];

// console.log(getParamValueByName(jsonArray, 'id', 'a115ae2a989a4bb4afd648fade36cdf3', 'paramsValue'));
// console.log(getParamValueByName(jsonArray, 'paramsName', 'VM_PassWord', 'paramsValue'));
export function findJsonArray(jsonArray, targetKey, targetKeyValue, targetKeyNew) {
  let result = '';
  for (let i = 0; i < jsonArray.length; i++) {
    // console.log(jsonArray[i])
    for (let key in jsonArray[i]) {
      if (jsonArray[i].hasOwnProperty(key)) {
        if (key === targetKey && jsonArray[i][key] === targetKeyValue) {
          //   console.log(`Key: ${key}, Value: ${jsonArray[i][key]}`);
          for (let key in jsonArray[i]) {
            if (jsonArray[i].hasOwnProperty(key) && key === targetKeyNew) {
              //  console.log(`Key: ${key}, Value: ${jsonArray[i][key]}`);
              result =  jsonArray[i][key]
            }
          }
        }
      }
    }
  }
  return result.toString();
}
export function findJsonArray1(jsonArray, targetKey, targetParamsName, targetParamsValue) {
  for (let i = 0; i < jsonArray.length; i++) {
    console.log(jsonArray[i])
    // console.log(Object.keys(jsonArray[i])[0])
    // console.log(Object.values(jsonArray[i])[0])
    // console.log(jsonArray[i][targetParamsValue])
    if (Object.keys(jsonArray[i])[0] === targetKey && Object.values(jsonArray[i])[0] === targetParamsName) {
      console.log(jsonArray[i][targetParamsValue])
      return jsonArray[i][targetParamsValue]
    }
  }
  return null;
}
// {
//   "paramsName": "VM_Name",
//   "paramsValue": "sakura@vsphere.local"
// }
export function findJsonArray2(jsonArray, paramsName, paramsValue) {
  const result = jsonArray.find(jsonArray => jsonArray[paramsName] === paramsValue).paramsValue;
  return result ? result.paramsValue : null;
}
export function findJsonArray3(jsonArray, paramsName, targetParamsValue) {
  for (let i = 0; i < jsonArray.length; i++) {
    if (jsonArray[i].paramsName === paramsName) {
      for (let key in jsonArray[i]) {
        if (jsonArray[i].hasOwnProperty(key) && key === targetParamsValue) {
          return jsonArray[i][key];
        }
      }
    }
  }
  return null;
}
// 找寻选中节点的子节点数组
export function findChildItem(data,activeId) {
	let result
    if (!data) {
      return // 如果data传空，直接返回
    }
	data.forEach(item => { 
		if (item.id === activeId) {
			result = item.children
		} else if(item.children && item.children.length > 0) {
      if (!result) {
        result = findChildItem(item.children,activeId)
      } else {
        return result
      }
		}
	})
	return result
}
// 找寻节点数组的所有id
export function findChildId(data, moudleIds = []) {
  if (!data) {
    return // 如果data传空，直接返回
  }
  data.forEach((item) => {
    moudleIds.push(item.id)
    if (item.children && item.children.length > 0) {
		findChildId(item.children,moudleIds)
    }
  })
  return moudleIds
}

// 可拖拽表单方法
export function dragTable(columns) {
  return {
    header: {
      cell: (h, props, children) => {
        const { key, ...restProps } = props
        const col = columns.find((col) => {
          const k = col.dataIndex || col.key
          return k === key
        })
        if (!col || !col.width) {
          return h('th', { ...restProps }, [...children])
        }
        const dragProps = {
          key: col.dataIndex || col.key,
          class: 'table-draggable-handle',
          attrs: {
            w: 10,
            x: col.width,
            z: 1,
            axis: 'x',
            draggable: true,
            resizable: false,
          },
          on: {
            dragging: (x, y) => {
              col.width = Math.max(x, 1)
            },
          },
        }
        const drag = h('vue-draggable-resizable', { ...dragProps })
        return h('th', { ...restProps, class: 'resize-table-th' }, [...children, drag])
      },
    },
    }
}