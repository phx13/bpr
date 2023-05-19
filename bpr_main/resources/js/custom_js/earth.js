/**
* 地球脚本
* author：phx
*/

// 设置地图服务地址
const tileMapUrl = 'http://127.0.0.1:6677/{z}/{x}/{y}.png';

// 设置地球管理实例
let earthManager = new EarthManager();
// 初始化地球
earthManager.initialize(tileMapUrl, 120, 20, 3500000);

// 获取地球
let earth = earthManager.getEarth();

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
    url: '../../models/Cesium_Air.glb'
}
// 将船舶模型加入地球
let boardModel = earthManager.addEntity(boardModelArgs);
