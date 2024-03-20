/**
 * 用户页脚本
 * author：phx
 */

// // 初始化用户列表
// let accountData = [];
// $('#accountTable').bootstrapTable({data: accountData});
//
// // 调用后端接口获取当前舰船的所有用户
// request.get(loadAccountUrl).then(res => {
//     console.log(res.data);
//     $('#accountTable').bootstrapTable('load', res.data);
// })

/**
 * 用户页脚本
 * author：phx
 */


$('#accountTable').bootstrapTable({
    url: loadAccountListUrl,  // 请求数据源的路由
    dataType: "json",
    pagination: true, //前端处理分页
    singleSelect: false,//是否只能单选
    search: true, //显示搜索框，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
    striped: true, //是否显示行间隔色
    cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    pageNumber: 1, //初始化加载第10页，默认第一页
    pageSize: 10, //每页的记录行数（*）
    pageList: [10, 20, 50, 100], //可供选择的每页的行数（*）
    strictSearch: true,//设置为 true启用 全匹配搜索，false为模糊搜索
    // showColumns: true, //显示内容列下拉框
    // showRefresh: true, //显示刷新按钮
    minimumCountColumns: 2, //当列数小于此值时，将隐藏内容列下拉框
    // clickToSelect: true, //设置true， 将在点击某行时，自动勾选rediobox 和 checkbox
    // height: 500, //表格高度，如果没有设置height属性，表格自动根据记录条数决定表格高度
    uniqueId: "id", //每一行的唯一标识，一般为主键列
    showToggle: false, //是否显示详细视图和列表视图的切换按钮
    // cardView: true, //是否显示详细视图
    // detailView: true, //是否显示父子表，设置为 true 可以显示详细页面模式,在每行最前边显示+号#}
    sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
    columns: [
        {
            title: "selectAll",
            field: "select",
            checkbox: true,
            align: "center",
            cellStyle: function () {
                $(".th-inner")[0].style.overflow = "inherit";
                return {css: {"overflow": "inherit"}}
            }
        }, {
            field: 'id',
            title: 'Id',
            align: "center",
            cellStyle: function () {
                return {css: {"color": "white"}}
            }
        }, {
            field: 'username',
            title: '用户名',
            align: "center",
            cellStyle: function () {
                return {css: {"color": "white"}}
            }
        }, {
            field: 'board_id',
            title: '所属舰船',
            align: "center",
            cellStyle: function () {
                return {css: {"color": "white"}}
            }
        }, {
            field: 'is_admin',
            title: '是否是管理员',
            align: "center",
            cellStyle: function () {
                return {css: {"color": "white"}}
            }
        }, {
            field: 'operation',
            title: '操作',
            formatter: function (value, row, index) {
                return '<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#accountDetail" onclick="editAccount(' + row.id + ')">编辑</button>'
            },
            align: "center",
            cellStyle: function () {
                return {css: {"color": "white"}}
            }
        }]
});

/**
 * 初始化用户详细信息
 * （将所有控件init）
 */
function initAccountDetail() {
    // 初始化用户信息
    $("#hiddenId").text("");
    $("#username").val("");
    $("#boardId").val("");
    $("#isAdmin").val("");
    // 显示创建按钮
    $("#createAccount")[0].style.display = "block";
    $("#updateAccount")[0].style.display = "none";
}


/**
 * 用户编辑方法
 * 根据用户主键id获取用户信息
 * @param id 用户主键id
 */
function editAccount(id) {
    // 初始化用户信息
    initAccountDetail();
    // 根据用户主键id获取用户信息
    request.get('/account/data/load/' + id).then(res => {
        if (!jQuery.isEmptyObject(res.data)) {
            // 设置用户信息
            $("#hiddenId").text(id);
            $("#username").val(res.data[0]['username']);
            $("#boardId").val(res.data[0]['board_id']);
            $("#isAdmin").val(res.data[0]['is_admin']);
            // 显示更新按钮
            $("#createAccount")[0].style.display = "None";
            $("#updateAccount")[0].style.display = "block";
        }
    })
}

/**
 * 创建用户方法
 */
function createAccount() {
    // 拼写参数串
    let param = "";
    param += 'username=' + $("#username").val();
    param += '&boardId=' + $("#boardId").val();
    // 发送创建post请求
    $.post('/account/data/add', param, function (data) {
            if (!jQuery.isEmptyObject(data)) {
                alert(data);
                // 刷新列表
                $('#accountTable').bootstrapTable('refresh');
            }
        }
    )
}

/**
 * 删除用户方法
 * 可批量删除
 */
function deleteAccount() {
    // 收集复选框选中的用户集合
    let accounts = $('#accountTable').bootstrapTable('getSelections');
    // 拼写参数串，按“用户主键id=id”的格式累加
    let param = "";
    accounts.forEach(function (item) {
        param += item["id"] + "=id&";
    })
    param = param.substring(0, param.length - 1);
    // 删除post请求
    $.post('/account/data/delete', param, function (data) {
            if (!jQuery.isEmptyObject(data)) {
                alert(data);
                // 刷新用户列表
                $('#accountTable').bootstrapTable('refresh');
            }
        }
    )
}

/**
 * 更新用户方法
 */
function updateAccount() {
    // 拼写参数串
    let param = "";
    param += 'username=' + $("#username").val();
    param += '&boardId=' + $("#boardId").val();
    param += '&isAdmin=' + $("#isAdmin").val();
    // 更新post请求
    $.post('/account/data/update/' + $("#hiddenId").text(), param, function (data) {
            if (!jQuery.isEmptyObject(data)) {
                alert(data);
                // 刷新列表
                $('#accountTable').bootstrapTable('refresh');
            }
        }
    )
}