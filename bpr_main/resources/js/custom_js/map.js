const mapIp = '127.0.0.1'; //地图服务ip
const mapPort = '6677'; //地图服务端口
const mapUrl = 'http://' + mapIp + ':' + mapPort + '/{z}/{x}/{y}.png'; //地图服务地址


/*初始化地图*/
function initMap(center, zoom) {
    //瓦片地图图层
    let tileLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: mapUrl
        })
    });

    //视角
    let view = new ol.View({
        center: ol.proj.fromLonLat(center),
        zoom: zoom,
        maxZoom: 15,
        minZoom: 4
    });

    return new ol.Map({
        target: 'map', //地图元素
        controls: [],
        layers: [
            tileLayer
        ],
        view: view
    });
}

/*初始化地球*/
function initEarth() {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhN2ZhMzE2YS1mNjA5LTQwNTItYjBlOC02MGU2ZTkxNGUxOTYiLCJpZCI6MTI0MTg3LCJpYXQiOjE2NzYwMTY5MzV9.aGgrCM7Quv8A3enmSh5c0vKC8duHOyJxbQdKk0-zJyc';

    let cesiumConfig = {
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false
    }

    const viewer = new Cesium.Viewer('earth', cesiumConfig);

    viewer._cesiumWidget._creditContainer.style.display = 'none';
}