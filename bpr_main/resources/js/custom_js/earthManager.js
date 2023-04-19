/* 地球管理类
* author：phx
 */

class EarthManager {
    // 构造
    constructor() {
    }

    viewer = null;

    getViewer() {
        return this.viewer;
    }

    // cesium配置
    cesiumConfig = {
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

    /*地球初始化方法
    * url：瓦片地图服务url
    * lon：初始化经度
    * lat：初始化纬度
    * height：初始化高度
    */
    initialize(url, lon, lat, height) {
        let viewer = new Cesium.Viewer('earth', this.cesiumConfig);

        const imageryLayers = viewer.imageryLayers;
        imageryLayers.remove(imageryLayers.get(0));

        // 使用XYZ方式加载本机服务中的地图瓦片
        const xyzImageryProvider = new Cesium.UrlTemplateImageryProvider({
            url: url,
            format: 'image/jpeg'
        });

        // 将地图瓦片资源作为地图图层并加入到影像图层容器中
        const xyzImageryLayer = new Cesium.ImageryLayer(xyzImageryProvider);
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

        this.viewer = viewer;
    }
}