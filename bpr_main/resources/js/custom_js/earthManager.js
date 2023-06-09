/**
 * 地球管理类
 * author：phx
 */

class EarthManager {
    /**
     * 地球
     */
    _earth = null;

    /**
     * cesium配置
     */
    _cesiumConfig = {
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

    /**
     * billboard配置
     */
    _billboardConfig = {
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

    /**
     * 实体种类
     */
    ENTITYTYPE = {
        BILLBOARD: 'Billboard',
        MODEL: 'Model'
    }

    /**
     * 构造
     */
    constructor() {
    }

    /**
     * 获取地球方法
     */
    getEarth() {
        return this._earth;
    }

    /**
     * 地球初始化方法
     * url：瓦片地图服务url
     * lon：初始化经度
     * lat：初始化纬度
     * height：初始化高度
     */
    initialize(url, lon, lat, height) {
        let viewer = new Cesium.Viewer('earth', this._cesiumConfig);

        let imageryLayers = viewer.imageryLayers;
        // imageryLayers.remove(imageryLayers.get(0));

        // 使用XYZ方式加载本机服务中的地图瓦片
        let xyzImageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: url,
            format: 'image/jpeg'
        });

        // 将地图瓦片资源作为地图图层并加入到影像图层容器中
        let xyzImageryLayer = new Cesium.ImageryLayer(xyzImageryProvider);
        imageryLayers.add(xyzImageryLayer);

        // 去除cesium的左下角商标
        viewer._cesiumWidget._creditContainer.style.display = 'none';

        // 初始化镜头位置
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-65),
            }
        });

        this._earth = viewer;
    }

    /**
     * 添加实体方法
     */
    addEntity(args) {
        const position = Cesium.Cartesian3.fromDegrees(args.lon, args.lat, args.height);
        switch (args.entityType) {
            case this.ENTITYTYPE.BILLBOARD:
                return this._earth.entities.add({
                    id: args.id,
                    position: position,
                    billboard: this._billboardConfig
                })
            case this.ENTITYTYPE.MODEL:
                const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(args.heading, args.pitch, args.roll));
                return this._earth.entities.add({
                    id: args.id,
                    position: position,
                    orientation: orientation,
                    model: {
                        uri: args.url,
                        minimumPixelSize: 128,
                        maximumScale: 20000,
                    },
                })
        }
    }

    /**
     * 删除全部实体方法
     */
    removeAllEntity() {
        this._earth.entities.removeAll();
    }

    /**
     * 获取实体方法
     */
    getEntityByName(entityName) {
        return this._earth.entities.getById(entityName);
    }

    /**
     * 经纬高2位置转换器
     */
    lonLatHeight2Position(lon, lat, height) {
        return Cesium.Cartesian3.fromDegrees(lon, lat, height);
    }
}