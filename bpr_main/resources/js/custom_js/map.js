/**
 * 二维地图页脚本
 * author：phx
 */

/**
 * 构建地图管理实例
 */
let mapManager = new MapManager();
/**
 * 数据更新频度
 */
let timeInterval;

/**
 * 初始化二维地图
 */
function initMap() {
    // 获取当前用户配置项
    request.get(loadConfigUrl).then(res => {
        // 设置地图服务地址
        const tileMapUrl = 'http://' + res.data['tile_map_ip'] + ':' + res.data['tile_map_port'] + '/{z}/{x}/{y}.png';
        // 设置数据更新频度
        timeInterval = res.data['time_interval'];
        // 初始化地图
        mapManager.initialize(tileMapUrl, res.data['map_init_lon'], res.data['map_init_lat'], res.data['map_init_zoom']);
    })
}

initMap();

// 初始化舰船信息
function initBoardInfo() {
    // 获取舰船信息
    request.get(loadBoardInfoUrl).then(res => {
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

// 更新数据
function updateBoardInfo() {
    // 开启定时器
    boardInterval = setInterval(function () {
        request.get(loadBoardInfoUrl).then(res => {
            // 更新二维地图坐标点
            mapManager.setFeatureGeomCoord(mapManager.getLayerById('boardIconLayer').getSource().getFeatureById('boardIcon'), [res.data['board_lon'], res.data['board_lat']]);
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
    mapManager.getLayerById('boardIconLayer').getSource().removeFeature(mapManager.getLayerById('boardIconLayer').getSource().getFeatureById('boardIcon'));
}