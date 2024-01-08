/**
 * 首页脚本
 * author：phx
 */


/**
 * 构建地图管理实例
 */
let mapManager = new MapManager();
/**
 * 设置地球管理实例
 */
let earthManager = new EarthManager();
/**
 * 数据更新频度
 */
let timeInterval;

/**
 * 初始化二维三维地图
 */
function initMapAndEarth() {
    // 获取当前用户配置项
    request.get(loadConfigUrl).then(res => {
        // 设置地图服务地址
        const tileMap2DUrl = 'http://' + res.data['tile_map_ip'] + ':' + res.data['tile_map_port'] + '/{z}/{x}/{-y}.png';
        const tileMap3DUrl = 'http://' + res.data['tile_map_ip'] + ':' + res.data['tile_map_port'];
        // 设置数据更新频度
        timeInterval = res.data['time_interval'];
        // 初始化地图
        mapManager.initialize(tileMap2DUrl, res.data['map_init_lon'], res.data['map_init_lat'], res.data['map_init_zoom']);
        // 初始化地球
        earthManager.initialize(tileMap3DUrl, res.data['map_init_lon'], res.data['map_init_lat'], res.data['map_init_height']);

        function onLeftClick() {
            let handler = earthManager.getHandler();
            let viewer = earthManager.getEarth();
            handler.setInputAction(function (movement) {
                viewer.selectedEntity = undefined;
                // const pickedEntity = viewer.scene.pick(movement.position);
                const pickPosition = viewer.scene.pickPosition(movement.position);
                // console.log(pickedEntity)
                console.log(pickPosition);
                if (pickPosition) {
                    earthManager.zoomTo(pickPosition);
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }

        onLeftClick();
    })
}

initMapAndEarth();

// 设置船舶billboard和model位置变量
let boardBillboardPosition, boardModelPosition;

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
            // 更新二维地图坐标点
            mapManager.setFeatureGeomCoord(mapManager.getLayerById('boardIconLayer').getSource().getFeatureById('boardIcon'), [res.data['board_lon'], res.data['board_lat']]);
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
    mapManager.getLayerById('boardIconLayer').getSource().removeFeature(mapManager.getLayerById('boardIconLayer').getSource().getFeatureById('boardIcon'));
    earthManager.removeAllEntity();
}

/**
 * 初始化首页终端情况图表
 */
function initTerminalIndexChart() {
    // 基于准备好的dom，初始化echarts实例
    let terminalIndexChart = echarts.init(document.getElementById('terminalIndexChart'));

    // 指定图表的配置项和数据
    let terminalIndexChartOption = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: '终端在线情况',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 30,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 60, name: '在线数量'},
                    {value: 40, name: '离线数量'}
                ]
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    terminalIndexChart.setOption(terminalIndexChartOption);
}

initTerminalIndexChart();

/**
 * 初始化首页设备情况图表
 */
function initEquipmentIndexChart() {
    // 基于准备好的dom，初始化echarts实例
    let equipmentIndexChart = echarts.init(document.getElementById('equipmentIndexChart'));

    // 指定图表的配置项和数据
    let equipmentIndexChartOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // Use axis to trigger tooltip
                type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            }
        },
        legend: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: ['蓝牙基站', 'LoRa基站', '北斗数传']
        },
        series: [
            {
                name: '在线数量',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [15, 4, 1]
            },
            {
                name: '离线数量',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [5, 2, 0]
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    equipmentIndexChart.setOption(equipmentIndexChartOption);
}

initEquipmentIndexChart();