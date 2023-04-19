/* 地图管理类
* author：phx
 */

class MapManager {
    // 构造
    constructor() {
    }

    // 地图
    map = null;

    // 获取地图
    getMap() {
        return this.map;
    }

    /*地图初始化方法
    * url：瓦片地图服务url
    * lon：初始化经度
    * lat：初始化纬度
    * zoom：初始化层级
    */
    initialize(url, lon, lat, zoom) {
        //瓦片地图图层
        let tileLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: url
            })
        });

        //视角
        let view = new ol.View({
            center: ol.proj.fromLonLat([lon, lat]),
            zoom: zoom,
            maxZoom: 15,
            minZoom: 3
        });

        this.map = new ol.Map({
            target: 'map', //地图元素
            controls: [],
            layers: [
                tileLayer
            ],
            view: view
        });
    }
}


