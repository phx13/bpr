/**
 * 蓝牙页脚本
 * author：phx
 */

// 初始化蓝牙基站列表
let bluetoothData = [];
$('#bluetoothTable').bootstrapTable({data: bluetoothData});

// 调用后端接口获取当前舰船的所有蓝牙基站
request.get(loadBluetoothUrl).then(res => {
    console.log(res.data);
    $('#bluetoothTable').bootstrapTable('load', res.data);
})