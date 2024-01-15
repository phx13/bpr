/**
 * 用户页脚本
 * author：phx
 */

// 初始化用户列表
let accountData = [];
$('#accountTable').bootstrapTable({data: accountData});

// 调用后端接口获取当前舰船的所有用户
request.get(loadAccountUrl).then(res => {
    console.log(res.data);
    $('#accountTable').bootstrapTable('load', res.data);
})
