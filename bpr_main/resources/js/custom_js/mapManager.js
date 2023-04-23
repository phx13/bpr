/*
* 地图管理类
* author：phx
*/

class MapManager {
    // 构造
    constructor() {
    }

    // 地图
    _map = null;

    // 瓦片地图图层
    _tileLayer = null;

    // 点样式
    _imageStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({color: 'yellow'}),
            stroke: new ol.style.Stroke({color: 'red', width: 1}),
        }),
    });

    /*
    * 获取地图
    */
    getMap() {
        return this._map;
    }

    /*
    * 设置瓦片地图图层
    */
    setTileLayer(url) {
        this._tileLayer = new ol.layer.Tile({
            preload: Infinity,
            source: new ol.source.XYZ({
                url: url
            })
        });
    }

    /*
    * 获取瓦片地图图层
    */
    getTileLayer() {
        return this._tileLayer;
    }

    /*
    * 获取点图标样式
    */
    getImageStyle() {
        return this._imageStyle;
    }

    /*地图初始化方法
    * lon：初始化经度
    * lat：初始化纬度
    * zoom：初始化层级
    */
    initialize(lon, lat, zoom) {
        //视角
        let view = new ol.View({
            center: ol.proj.fromLonLat([lon, lat]),
            zoom: zoom,
            maxZoom: 15,
            minZoom: 3
        });

        this._map = new ol.Map({
            target: 'map', //地图元素
            controls: [],
            layers: [
                this._tileLayer
            ],
            view: view
        });
    }


}


