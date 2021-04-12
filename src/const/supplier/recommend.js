const supType = {
    1: '代理',
    2: '制造',
    properties: [
        { label: "代理", value: 1 },
        { label: "制造", value: 2 }
    ]
}
const proType = {
    "1": '成品',
    "2": '配件',
    "3": "原料",
    "4": "其他",
    properties: [
        { label: "成品", value: "1" },
        { label: "配件", value: "2" },
        { label: "原料", value: "3" },
        { label: "其他", value: "4" }
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
export { supType, proType, simpleStatus }
