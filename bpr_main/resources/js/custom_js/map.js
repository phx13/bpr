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
    let cesiumConfig = {
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        imageryProvider: new Cesium.TileMapServiceImageryProvider({
            url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
        })
    }

    const viewer = new Cesium.Viewer('earth', cesiumConfig);

    const imageryLayers = viewer.imageryLayers;
    imageryLayers.remove(imageryLayers.get(0));

    // 使用XYZ方式加载本机服务中的地图瓦片
    const xyzImageryProvider = new Cesium.UrlTemplateImageryProvider({
        url: mapUrl,
        format: 'image/jpeg'
    });

    // 将地图瓦片资源作为地图图层并加入到影像图层容器中
    const xyzImageryLayer = new Cesium.ImageryLayer(xyzImageryProvider);
    imageryLayers.add(xyzImageryLayer);

    // 去除cesium的左下角商标
    viewer._cesiumWidget._creditContainer.style.display = 'none';

    // 初始化镜头位置
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(120, 20, 3500000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-65),
        }
    });
}