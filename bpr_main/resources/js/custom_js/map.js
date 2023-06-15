/**
 * 二维地图页脚本
 * author：phx
 */
let request = axios.create({
    timeout: 20000
})
// 调用后端接口获取当前舰船的所有蓝牙基站
request.get(loadConfigUrl).then(res => {
    console.log(res.data);
})

// 设置地图服务地址
const tileMapUrl = 'http://127.0.0.1:6677/{z}/{x}/{y}.png';
// 构建地图管理实例
let mapManager = new MapManager();
// 设置瓦片地图图层
mapManager.setTileLayer(tileMapUrl);
// 根据位置初始化地图
mapManager.initialize(120, 38, 6);

// 获取地图
let map = mapManager.getMap();

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