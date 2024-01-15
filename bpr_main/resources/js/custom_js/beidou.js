/**
 * 北斗页脚本
 * author：phx
 */

// 初始化蓝牙基站列表
let beidouData = [];
$('#beidouTable').bootstrapTable({data: beidouData});

// 调用后端接口获取当前舰船的所有北斗数传
request.get(loadBeidouUrl).then(res => {
    console.log(res.data);
    $('#beidouTable').bootstrapTable('load', res.data);
})