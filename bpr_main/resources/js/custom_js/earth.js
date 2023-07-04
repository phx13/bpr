/**
 * 地球脚本
 * author：phx
 */


/**
 * 设置地球管理实例
 */
let earthManager = new EarthManager();
/**
 * 数据更新频度
 */
let timeInterval;

/**
 * 初始化三维地图
 */
function initEarth() {
    // 获取当前用户配置项
    request.get(loadConfigUrl).then(res => {
        // 设置地图服务地址
        const tileMapUrl = 'http://' + res.data['tile_map_ip'] + ':' + res.data['tile_map_port'] + '/{z}/{x}/{y}.png';
        // 设置数据更新频度
        timeInterval = res.data['time_interval'];
        // 初始化地球
        earthManager.initialize(tileMapUrl, res.data['map_init_lon'], res.data['map_init_lat'], res.data['map_init_height']);
    })
}

initEarth();

// 设置船舶billboard和model位置变量
let boardBillboardPosition, boardModelPosition;

// 初始化舰船信息
function initBoardInfo() {
    // 获取舰船信息
    request.get(loadBoardInfoUrl).then(res => {
        // 构建舰船在三维地球的位置
        // 创建船舶标牌参数
        let boardBillboardArgs = {
            entityType: earthManager.ENTITYTYPE.BILLBOARD,
            id: 'boardBillboard',
            lon: res.data['board_lon'],
            lat: res.data['board_lat'],
            height: 0
        }
        // 根据id获取billboard实例
        let boardBillboard = earthManager.getEntityByName(boardBillboardArgs.id);
        // 如果没有该billboard
        if (boardBillboard === undefined) {
            // 添加billboard
            boardBillboard = earthManager.addEntity(boardBillboardArgs);
            // 获取billboard位置
            boardBillboardPosition = boardBillboard._position.getValue();
            // 注册billboard位置回调函数
            boardBillboard._position = new Cesium.CallbackProperty(function () {
                return boardBillboardPosition;
            }, false);
        }

        // 创建船舶模型参数
        let boardModelArgs = {
            entityType: earthManager.ENTITYTYPE.MODEL,
            id: 'boardModel',
            lon: res.data['board_lon'],
            lat: res.data['board_lat'],
            height: 0,
            heading: 0,
            pitch: 0,
            roll: 0,
            url: '../../models/board.gltf'
        }
        // 根据id获取model实例
        let boardModel = earthManager.getEntityByName(boardModelArgs.id);
        // 如果没有该model
        if (boardModel === undefined) {
            // 添加model
            boardModel = earthManager.addEntity(boardModelArgs);
            // 获取model位置
            boardModelPosition = boardModel._position.getValue();
            // 注册model位置回调函数
            boardModel._position = new Cesium.CallbackProperty(function () {
                return boardModelPosition;
            }, false);
        }
    })
}

// 船舶数据更新定时器
let boardInterval;

// 更新数据
function updateBoardInfo() {
    // 开启定时器
    boardInterval = setInterval(function () {
        request.get(loadBoardInfoUrl).then(res => {
            // 更新三维地球坐标点
            boardBillboardPosition = earthManager.lonLatHeight2Position(res.data['board_lon'], res.data['board_lat'], 0);
            boardModelPosition = earthManager.lonLatHeight2Position(res.data['board_lon'], res.data['board_lat'], 0);
        })
    }, timeInterval);
}

// 停止更新数据
function stopUpdateBoardInfo() {
    // 关闭定时器
    clearInterval(boardInterval);
}

// 清除数据
function clearBoardInfo() {
    // 关闭定时器
    clearInterval(boardInterval);
    // 清除舰船数据
    earthManager.removeAllEntity();
}