const checkStatus = {
    "0": '新建',
    "1": '临时供应商',
    "2": '临时供应商申请拒绝',
    "3": '临时供应商申请中',
    properties: [
        { label: "新建", value: "0" },
        { label: "临时供应商申请拒绝", value: "2" },
        { label: "临时供应商申请中", value: "3" },
        { label: "临时供应商", value: "1" },
    ]
}
const types = {
    "0": '其它',
    "1": '成品',
    "2": '配件',
    "3": '原料',
    properties: [
        { label: "其它", value: "0" },
        { label: "成品", value: "1" },
        { label: "配件", value: "2" },
        { label: "原料", value: "3" },
    ]
}
const accessStatus = {
    // "10": '新建',
    // "15": '临时供应商申请拒绝',
    // "20": '临时供应商申请中',
    "30": '临时供应商',
    "35": '准入初审拒绝',
    "40": '准入初审中',
    "50": '准入初审通过',
    "55": '计划审批拒绝',
    "60": '改进计划审批中',
    "70": '改进计划审批通过',
    "75": '改进结果审批拒绝',
    "80": '改进结果审批中',
    "90": '财务审批拒绝',
    "95": '财务重审批中',
    "100": '合格供应商',
    "0": '禁用',
}
const modifyCheckStatus = {
    "0": '初始',
    "1": '通过',
    "2": '不通过',
    "3": '取消',
    properties: [
        { label: "待准", value: "0" },
        { label: "通过", value: "1" },
        { label: "不通过", value: "2" },
        { label: "取消", value: "3" },
    ]
}
const enableStatus = {
    "false": '禁用',
    "true": '启用',
    properties: [
        { label: "禁用", value: false },
        { label: "启用", value: true }
    ]
}
const simpleStatus = {
    "false": '否',
    "true": '是',
    properties: [
        { label: "否", value: false },
        { label: "是", value: true }
    ]
}
const allowStatus = {
    "false": '不能',
    "true": '能',
    properties: [
        { label: "不能", value: false },
        { label: "能", value: true }
    ]
}
const gender = {
    "0": '保密',
    "1": '男',
    "2": '女',
    properties: [
        { label: "保密", value: "0" },
        { label: "男", value: "1" },
        { label: "女", value: "2" }
    ]
}
const supplierType = {
    "1": '费用供应商',
    "2": '产品供应商',
    properties: [
        { label: "费用供应商", value: "1" },
        { label: "产品供应商", value: "2" }
    ]
}
export { accessStatus,types,checkStatus, modifyCheckStatus, enableStatus, simpleStatus, allowStatus, gender, supplierType }
