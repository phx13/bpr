/**
 * 北斗页脚本
 * author：phx
 */


$('#beidouTable').bootstrapTable({
    url: loadBeidouListUrl,  // 请求数据源的路由
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
            field: 'beidou_id',
            title: '北斗数传号',
            align: "center",
            cellStyle: function () {
                return {css: {"color": "white"}}
            }
        }, {
            field: 'card_id',
            title: '北斗卡号',
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
            field: 'position_x',
            title: 'x坐标',
            align: "center",
            cellStyle: function () {
                return {css: {"color": "white"}}
            }
        }, {
            field: 'position_y',
            title: 'y坐标',
            align: "center",
            cellStyle: function () {
                return {css: {"color": "white"}}
            }
        }, {
            field: 'position_z',
            title: 'z坐标',
            align: "center",
            cellStyle: function () {
                return {css: {"color": "white"}}
            }
        }, {
            field: 'mode',
            title: '在线情况',
            align: "center",
            formatter: function (value, row, index) {
                switch (value) {
                    case 1:
                        return '在线'
                    case 0:
                        return '不在线'
                }
            },
            cellStyle: function () {
                return {css: {"color": "white"}}
            }
        }, {
            field: 'operation',
            title: '操作',
            formatter: function (value, row, index) {
                return '<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#beidouDetail" onclick="editBeidou(' + row.id + ')">编辑</button>'
            },
            align: "center",
            cellStyle: function () {
                return {css: {"color": "white"}}
            }
        }]
});

/**
 * 初始化北斗详细信息
 * （将所有控件init）
 */
function initBeidouDetail() {
    // 初始化北斗信息
    $("#hiddenId").text("");
    $("#beidouId").val("");
    $("#cardId").val("");
    $("#boardId").val("");
    $("#beidouPositionX").val("");
    $("#beidouPositionY").val("");
    $("#beidouPositionZ").val("");
    $("#mode").val("");
    // 显示创建按钮
    $("#createBeidou")[0].style.display = "block";
    $("#updateBeidou")[0].style.display = "none";
}


/**
 * 北斗编辑方法
 * 根据北斗主键id获取北斗信息
 * @param id 北斗主键id
 */
function editBeidou(id) {
    // 初始化北斗信息
    initBeidouDetail();
    // 根据北斗主键id获取北斗信息
    request.get('/beidou/data/load/' + id).then(res => {
        if (!jQuery.isEmptyObject(res.data)) {
            // 设置北斗信息
            $("#hiddenId").text(id);
            $("#beidouId").val(res.data[0]['beidou_id']);
            $("#cardId").val(res.data[0]['card_id']);
            $("#boardId").val(res.data[0]['board_id']);
            $("#beidouPositionX").val(res.data[0]['position_x']);
            $("#beidouPositionY").val(res.data[0]['position_y']);
            $("#beidouPositionZ").val(res.data[0]['position_z']);
            $("#mode").val(res.data[0]['mode']);
            // 显示更新按钮
            $("#createBeidou")[0].style.display = "None";
            $("#updateBeidou")[0].style.display = "block";
        }
    })
}

/**
 * 创建北斗方法
 */
function createBeidou() {
    // 拼写参数串
    let param = "";
    param += 'beidouId=' + $("#beidouId").val();
    param += '&boardId=' + $("#boardId").val();
    param += '&beidouPositionX=' + $("#beidouPositionX").val();
    param += '&beidouPositionY=' + $("#beidouPositionY").val();
    param += '&beidouPositionZ=' + $("#beidouPositionZ").val();
    param += '&mode=' + $("#mode").val();
    // 发送创建post请求
    $.post('/beidou/data/add', param, function (data) {
            if (!jQuery.isEmptyObject(data)) {
                alert(data);
                // 刷新列表
                $('#beidouTable').bootstrapTable('refresh');
            }
        }
    )
}

/**
 * 删除北斗方法
 * 可批量删除
 */
function deleteBeidou() {
    // 收集复选框选中的北斗集合
    let beidous = $('#beidouTable').bootstrapTable('getSelections');
    // 拼写参数串，按“北斗主键id=id”的格式累加
    let param = "";
    beidous.forEach(function (item) {
        param += item["id"] + "=id&";
    })
    param = param.substring(0, param.length - 1);
    // 删除post请求
    $.post('/beidou/data/delete', param, function (data) {
            if (!jQuery.isEmptyObject(data)) {
                alert(data);
                // 刷新北斗列表
                $('#beidouTable').bootstrapTable('refresh');
            }
        }
    )
}

/**
 * 更新北斗方法
 */
function updateBeidou() {
    // 拼写参数串
    let param = "";
    param += 'beidouId=' + $("#beidouId").val();
    param += '&boardId=' + $("#boardId").val();
    param += '&beidouPositionX=' + $("#beidouPositionX").val();
    param += '&beidouPositionY=' + $("#beidouPositionY").val();
    param += '&beidouPositionZ=' + $("#beidouPositionZ").val();
    param += '&mode=' + $("#mode").val();
    // 更新post请求
    $.post('/beidou/data/update/' + $("#hiddenId").text(), param, function (data) {
            if (!jQuery.isEmptyObject(data)) {
                alert(data);
                // 刷新列表
                $('#beidouTable').bootstrapTable('refresh');
            }
        }
    )
}