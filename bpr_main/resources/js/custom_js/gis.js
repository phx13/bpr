/**
 * 地球脚本
 * author：phx
 */


/**
 * 设置地球管理实例
 */
let earthManager = new EarthManager();
/**
 * 构建地图管理实例
 */
let mapManager = new MapManager();
/**
 * 数据更新频度
 */
let timeInterval;


/**
 * 初始化二三维地图
 */
function initEarth() {
    // 获取当前用户配置项
    request.get(loadConfigUrl).then(res => {
        // 设置地图服务地址
        const tileMap3DUrl = 'http://' + res.data['tile_map_ip'] + ':' + res.data['tile_map_port'];
        // 设置数据更新频度
        timeInterval = res.data['time_interval'];
        // 初始化地球
        earthManager.initialize(tileMap3DUrl, res.data['map_init_lon'], res.data['map_init_lat'], res.data['map_init_height']);

        // 设置地图服务地址
        const tileMap2DUrl = 'http://' + res.data['tile_map_ip'] + ':' + res.data['tile_map_port'] + '/{z}/{x}/{-y}.png';
        // 设置数据更新频度
        timeInterval = res.data['time_interval'];
        // 初始化地图
        mapManager.initialize(tileMap2DUrl, res.data['map_init_lon'], res.data['map_init_lat'], res.data['map_init_zoom']);
    })
}

initEarth();

// 设置船舶billboard和model位置变量
let boardBillboardPosition, boardModelPosition;

/**
 * 初始化舰船信息
 */
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

        // 构建舰船在二维地图的位置
        // 1.创建一个图层
        let boardIconLayer;
        if (mapManager.getLayerById('boardIconLayer') === undefined) {
            boardIconLayer = mapManager.createLayer(mapManager.LAYERTYPE.Vector, 'boardIconLayer');
            mapManager.addLayer(boardIconLayer);
        } else {
            boardIconLayer = mapManager.getLayerById('boardIconLayer');
        }

        // 2.图层添加资源
        let boardIconSource;
        if (boardIconLayer.getSource() === null) {
            boardIconSource = mapManager.createSource(mapManager.SOURCETYPE.Vector, 'boardIconSource');
            boardIconLayer.setSource(boardIconSource);
        } else {
            boardIconSource = boardIconLayer.getSource()
        }

        // 3.资源中加入要素点集合
        // 创建船舶点要素样式
        let boardIconStyleArgs = {
            'styleType': mapManager.STYLETYPE.ImageIcon,
            'imageUrl': '../../images/icons/location.jpg',
            'anchor': [0.5, 0.5],
            'anchorOrigin': mapManager.ANCHORORIGIN.TOP,
            'scale': 0.2
        }
        let boardIconStyle = mapManager.createStyle(boardIconStyleArgs);
        // 创建船舶点要素
        let boardIconFeature = mapManager.createFeature(mapManager.GEOMTYPE.Point, [res.data['board_lon'], res.data['board_lat']]);
        // 为点特性设置点样式
        boardIconFeature.setStyle(boardIconStyle);
        boardIconFeature.setId('boardIcon');
        boardIconSource.addFeature(boardIconFeature);
    })
}

// 船舶数据更新定时器
let boardInterval;

/**
 * 更新舰船数据信息
 */
function updateBoardInfo() {
    // 开启定时器
    boardInterval = setInterval(function () {
        request.get(loadBoardInfoUrl).then(res => {
            // 更新三维地球坐标点
            boardBillboardPosition = earthManager.lonLatHeight2Position(res.data['board_lon'], res.data['board_lat'], 0);
            boardModelPosition = earthManager.lonLatHeight2Position(res.data['board_lon'], res.data['board_lat'], 0);

            // 更新二维地图坐标点
            mapManager.setFeatureGeomCoord(mapManager.getLayerById('boardIconLayer').getSource().getFeatureById('boardIcon'), [res.data['board_lon'], res.data['board_lat']]);
        })
    }, timeInterval);
}

/**
 * 停止更新数据
 */
function stopUpdateBoardInfo() {
    // 关闭定时器
    clearInterval(boardInterval);
}

/**
 * 清除数据
 */
function clearBoardInfo() {
    // 关闭定时器
    clearInterval(boardInterval);
    // 清除三维舰船数据
    earthManager.removeAllEntity();
    // 清除二维舰船数据
    mapManager.getLayerById('boardIconLayer').getSource().removeFeature(mapManager.getLayerById('boardIconLayer').getSource().getFeatureById('boardIcon'));
}

/**
 * 切换二三维地图
 */
function changeGIS() {
    if (document.getElementById('map').style.display === 'none') {
        document.getElementById('map').style.display = 'block';
        document.getElementById('mapTitle').style.display = 'block';
        document.getElementById('map').style.zIndex = '0';
        document.getElementById('mapTitle').style.zIndex = '0';
        document.getElementById('earth').style.display = 'none';
        document.getElementById('earthTitle').style.display = 'none';
        document.getElementById('earth').style.zIndex = '-1';
        document.getElementById('earthTitle').style.zIndex = '-1';
    } else {
        document.getElementById('map').style.display = 'none';
        document.getElementById('mapTitle').style.display = 'none';
        document.getElementById('map').style.zIndex = '-1';
        document.getElementById('mapTitle').style.zIndex = '-1';
        document.getElementById('earth').style.display = 'block';
        document.getElementById('earthTitle').style.display = 'block';
        document.getElementById('earth').style.zIndex = '0';
        document.getElementById('earthTitle').style.zIndex = '0';
    }
}