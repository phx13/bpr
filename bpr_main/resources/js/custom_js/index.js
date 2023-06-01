/**
 * 首页脚本
 * author：phx
 */

// 设置地图服务地址
const tileMapUrl = 'http://127.0.0.1:6677/{z}/{x}/{y}.png';
// 构建地图管理实例
let mapManager = new MapManager();
// 设置瓦片地图图层
mapManager.setTileLayer(tileMapUrl);
// 根据位置初始化地图
mapManager.initialize(120, 38, 6);

// 设置地球管理实例
let earthManager = new EarthManager();
// 初始化地球
earthManager.initialize(tileMapUrl, 120, 20, 3500000);

// 获取地图
let map = mapManager.getMap();
// 获取地球
let earth = earthManager.getEarth();

// 构建舰船在二维地图的位置
// 创建船舶点要素样式
let styleArgs = {
    'styleType': mapManager.STYLETYPE.ImageIcon,
    'imageUrl': '../../images/icons/location.jpg',
    'anchor': [0.5, 0.5],
    'anchorOrigin': mapManager.ANCHORORIGIN.TOP,
    'scale': 0.2
}
let boardStyle = mapManager.createStyle(styleArgs);
// 创建船舶点要素
let boardFeature = mapManager.createFeature(mapManager.GEOMTYPE.Point, 'board', [122, 40]);
// 为点特性设置点样式
boardFeature.setStyle(boardStyle);
// 创建点要素数组，并将点要素加入数组
let boardFeatures = [];
boardFeatures.push(boardFeature);
// 创建矢量点图层，将点要素数组加入
let boardLayer = mapManager.createVectorLayer(boardFeatures);

// 将矢量点图层加入地图
map.addLayer(boardLayer);

// earth
// 创建船舶标牌参数
let boardBillboardArgs = {
    entityType: earthManager.ENTITYTYPE.BILLBOARD,
    id: 'boardBillboard',
    lon: 122,
    lat: 40,
    height: 0
}
// 将船舶标牌加入地球
let boardBillboard = earthManager.addEntity(boardBillboardArgs);

// 创建船舶模型参数
let boardModelArgs = {
    entityType: earthManager.ENTITYTYPE.MODEL,
    id: 'boardModel',
    lon: 122,
    lat: 40,
    height: 3000,
    heading: 10,
    pitch: 0,
    roll: 0,
    url: '../../models/board.gltf'
}
// 将船舶模型加入地球
let boardModel = earthManager.addEntity(boardModelArgs);
