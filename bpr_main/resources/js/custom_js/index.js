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


// let tileLayer = mapManager.getTileLayer();
// console.log(tileLayer);
//
//
// const n = 200;
// const omegaTheta = 30000; // Rotation period in ms
// const R = 7e6;
// const r = 2e6;
// const p = 2e6;
// tileLayer.on('postrender', function (event) {
//     const vectorContext = ol.render.getVectorContext(event);
//     const frameState = event.frameState;
//     const theta = (2 * Math.PI * frameState.time) / omegaTheta;
//     const coordinates = [];
//     let i;
//     for (i = 0; i < n; ++i) {
//         const t = theta + (2 * Math.PI * i) / n;
//         const x = (R + r) * Math.cos(t) + p * Math.cos(((R + r) * t) / r);
//         const y = (R + r) * Math.sin(t) + p * Math.sin(((R + r) * t) / r);
//         coordinates.push([x, y]);
//     }
//     vectorContext.setStyle(mapManager.getImageStyle());
//     vectorContext.drawGeometry(new ol.geom.MultiPoint(coordinates));
//
//     const headPoint = new ol.geom.Point(coordinates[coordinates.length - 1]);
//
//     vectorContext.setStyle(mapManager.getImageStyle());
//     vectorContext.drawGeometry(headPoint);
//
//     vectorContext.setStyle(mapManager.getImageStyle());
//     vectorContext.drawGeometry(headPoint);
//
//     map.render();
// });
// map.render();
//
// const style = new ol.style.Style({
//     fill: new ol.style.Fill({
//         color: '#eeeeee',
//     }),
// });
// const vectorLayer = new ol.layer.VectorImage({
//     background: '#1a2b39',
//     imageRatio: 2,
//     source: new ol.source.Vector({
//         url: 'https://openlayers.org/data/vector/ecoregions.json',
//         format: new ol.format.GeoJSON(),
//     }),
//     style: function (feature) {
//         const color = feature.get('COLOR') || '#eeeeee';
//         style.getFill().setColor(color);
//         return style;
//     },
// });
map.addLayer(vectorLayer);
console.log(map);
console.log(vectorLayer);