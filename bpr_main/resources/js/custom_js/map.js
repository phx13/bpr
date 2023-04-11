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
        target: 'map2d', //地图元素
        controls: [],
        layers: [
            tileLayer
        ],
        view: view
    });
}