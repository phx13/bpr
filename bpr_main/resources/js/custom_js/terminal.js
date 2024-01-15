/**
 * 终端页脚本
 * author：phx
 */

// 初始化终端列表
let terminalData = [];
$('#terminalTable').bootstrapTable({data: terminalData});

// 调用后端接口获取当前舰船的所有终端
request.get(loadTerminalUrl).then(res => {
    console.log(res.data);
    $('#terminalTable').bootstrapTable('load', res.data);
})