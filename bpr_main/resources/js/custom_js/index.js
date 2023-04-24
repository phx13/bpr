/*
* 首页脚本
*/

// 设置地图服务地址
const url = 'http://127.0.0.1:6677/{z}/{x}/{y}.png';
// 构建地图管理实例
let mapManager = new MapManager();
// 设置瓦片地图图层
mapManager.setTileLayer(url);
// 根据位置初始化地图
mapManager.initialize(120, 38, 6);

// 设置地球管理实例
let earthManager = new EarthManager();
// 初始化地球
earthManager.initialize(url, 120, 20, 3500000);

// 获取地图
let map = mapManager.getMap();

// 获取地球
let earth = earthManager.getViewer();

let iconFeatures = [];
let iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([122, 40])),
    longitude: 122,
    latitude: 40
});

let iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
        anchor: [0.5, 0.5],
        anchorOrigin: 'top',
        src: '../../images/icons/location.jpg',
        scale: 0.15
    })
});
iconFeature.setStyle(iconStyle);
iconFeatures.push(iconFeature);

let vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: iconFeatures
    })
});


map.addLayer(vectorLayer);
console.log(map);
console.log(vectorLayer);

// earth

earth.entities.add({
    position: Cesium.Cartesian3.fromDegrees(122, 40),
    billboard: {
        image: '../../images/icons/location.jpg', // default: undefined
        show: true, // default
        pixelOffset: new Cesium.Cartesian2(0, 0), // default: (0, 0)
        eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // default
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
        scale: 1, // default: 1.0
        color: Cesium.Color.LIME, // default: WHITE
        rotation: 0, // default: 0.0
        alignedAxis: Cesium.Cartesian3.ZERO, // default
        width: 50, // default: undefined
        height: 25, // default: undefined
    }
});

// earth.entities.add({
//     position: Cesium.Cartesian3.fromDegrees(122, 40, 5000),
//     model: {
//         uri: '../../models/Cesium_Air.glb'
//     }
// });

function createModel(id, url, height) {
    // earth.entities.removeAll();

    const position = Cesium.Cartesian3.fromDegrees(
        122,
        40,
        height
    );
    const heading = Cesium.Math.toRadians(135);
    const pitch = 0;
    const roll = 0;
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
    );

    const entity = earth.entities.add({
        id: id,
        name: url,
        position: position,
        orientation: orientation,
        model: {
            uri: url,
            minimumPixelSize: 128,
            maximumScale: 20000,
        },
    });
    // earth.trackedEntity = entity;
}

createModel('plane1',
    "../../models/Cesium_Air.glb",
    5000.0
);

let plane1 = earth.entities.getById('plane1');
console.log(plane1);
