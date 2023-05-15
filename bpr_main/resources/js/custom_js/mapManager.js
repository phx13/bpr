/**
 * 地图管理类
 * author：phx
 */

class MapManager {
    /**
     * 构造
     */
    constructor() {
    }

    /**
     * 地图
     */
    _map = null;

    /**
     * 瓦片地图图层
     */
    _tileLayer = null;

    /**
     * 对齐方式
     */
    ANCHORORIGIN = {
        TOP: 'top', LEFT: 'left', RIGHT: 'right', BOTTOM: 'bottom'
    }

    /**
     * 几何体类型
     */
    GEOMTYPE = {
        Circle: 'Circle',
        LineString: 'LineString',
        LinearRing: 'LinearRing',
        MultiLineString: 'MultiLineString',
        MultiPoint: 'MultiPoint',
        MultiPolygon: 'MultiPolygon',
        Point: 'Point',
        Polygon: 'Polygon',
    }

    /**
     * 样式类型
     */
    STYLETYPE = {
        Fill: 'Fill',
        ImageIcon: 'ImageIcon',
        ImageCircle: 'ImageCircle',
        Stroke: 'Stroke'
    }

    /**
     * 地图初始化方法
     * lon：初始化经度
     * lat：初始化纬度
     * zoom：初始化层级
     */
    initialize(lon, lat, zoom) {
        //视角
        let view = new ol.View({
            center: ol.proj.fromLonLat([lon, lat]), zoom: zoom, maxZoom: 15, minZoom: 3
        });

        this._map = new ol.Map({
            target: 'map', //地图元素
            controls: [], layers: [this._tileLayer], view: view
        });
    }

    /**
     * 获取地图
     */
    getMap() {
        return this._map;
    }

    /**
     * 设置瓦片地图图层
     * url：瓦片地图地址
     */
    setTileLayer(url) {
        this._tileLayer = new ol.layer.Tile({
            preload: Infinity, source: new ol.source.XYZ({
                url: url
            })
        });
    }

    /**
     * 获取瓦片地图图层
     */
    getTileLayer() {
        return this._tileLayer;
    }

    /**
     * 创建要素样式
     * args：可选参数
     */
    createStyle(args) {
        switch (args.styleType) {
            case this.STYLETYPE.Fill:
                return new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: args.color || 'rgba(0, 0, 255, 0.1)',
                    })
                })
            case this.STYLETYPE.Stroke:
                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: args.color || '#3399CC',
                        width: args.width || 3,
                    })
                })
            case this.STYLETYPE.ImageIcon:
                return new ol.style.Style({
                    image: new ol.style.Icon({
                        crossOrigin: 'anonymous',
                        src: args.imageUrl || '../../images/icons/location.jpg',
                        anchor: args.anchor || [0.5, 0.5],
                        anchorOrigin: args.anchorOrigin || this.ANCHORORIGIN.Top,
                        scale: args.scale || 0.2
                    })
                })
            case this.STYLETYPE.ImageCircle:
                return new ol.style.Style({
                    image: new ol.style.Circle({
                        fill: new ol.style.Fill({
                            color: args.color || 'rgba(0, 0, 255, 0.1)',
                        }),
                        radius: 5
                    })
                })
        }
    }

    /**
     * 创建地图要素
     * geomType：要素的几何体种类
     * name：要素名字
     * coordinates：要素经纬度坐标
     */
    createFeature(geomType, name, coordinates) {
        switch (geomType) {
            case this.GEOMTYPE.Circle:
                return new ol.Feature({
                    id: name, geometry: new ol.geom.Circle(ol.proj.fromLonLat(coordinates))
                })
            case this.GEOMTYPE.LineString:
                return new ol.Feature({
                    id: name, geometry: new ol.geom.LineString(ol.proj.fromLonLat(coordinates))
                })
            case this.GEOMTYPE.LinearRing:
                return new ol.Feature({
                    id: name, geometry: new ol.geom.LinearRing(ol.proj.fromLonLat(coordinates))
                })
            case this.GEOMTYPE.MultiLineString:
                return new ol.Feature({
                    id: name, geometry: new ol.geom.MultiLineString(ol.proj.fromLonLat(coordinates))
                })
            case this.GEOMTYPE.MultiPoint:
                return new ol.Feature({
                    id: name, geometry: new ol.geom.MultiPoint(ol.proj.fromLonLat(coordinates))
                })
            case this.GEOMTYPE.MultiPolygon:
                return new ol.Feature({
                    id: name, geometry: new ol.geom.MultiPolygon(ol.proj.fromLonLat(coordinates))
                })
            case this.GEOMTYPE.Point:
                return new ol.Feature({
                    id: name, geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates))
                })
            case this.GEOMTYPE.Polygon:
                return new ol.Feature({
                    id: name, geometry: new ol.geom.Polygon(ol.proj.fromLonLat(coordinates))
                })
        }
    }

    /**
     * 创建矢量点图层
     * features：要素点集合
     */
    createVectorLayer(features) {
        return new ol.layer.Vector({
            source: new ol.source.Vector({
                features: features
            })
        });
    }
}
