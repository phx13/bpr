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
     * 处理器
     */
    _handler = null;

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
     * 获取处理器方法
     */
    getHandler() {
        this._handler = new Cesium.ScreenSpaceEventHandler(this._earth.scene.canvas);
        return this._handler;
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

        // // 使用XYZ方式加载本机服务中的地图瓦片
        // let xyzImageryProvider = new Cesium.UrlTemplateImageryProvider({
        //     url: url,
        //     format: 'image/jpeg'
        // });
        //
        // // 将地图瓦片资源作为地图图层并加入到影像图层容器中
        // let xyzImageryLayer = new Cesium.ImageryLayer(xyzImageryProvider);
        // imageryLayers.add(xyzImageryLayer);

        imageryLayers.addImageryProvider(
            new Cesium.TileMapServiceImageryProvider({
                url: url,
            })
        );

        // 去除cesium的左下角商标
        viewer._cesiumWidget._creditContainer.style.display = 'none';

        // 初始化镜头位置
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-90),
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

    /**
     * 移动方法
     */
    zoomTo(pickPosition) {
        //将笛卡尔坐标转化为弧度坐标
        const cartographic = Cesium.Cartographic.fromCartesian(pickPosition);
        console.log("弧度：" + cartographic);

        // // 获取点的经纬度
        // const cartographic = Cesium.Cartographic.fromCartesian(feature.primitive._actualPosition);
        // // 转换为数组，0经度，1纬度，2高度
        // const point = [cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, cartographic.height / Math.PI * 180];
        //
        const longitude = Cesium.Math.toRadians(
            Cesium.Math.toDegrees(cartographic.longitude) //经度
        );
        const latitude = Cesium.Math.toRadians(
            Cesium.Math.toDegrees(cartographic.latitude) //纬度
        );
        const height = 100000; //高度

        // 转换为Cartesian3
        const destination = Cesium.Cartesian3.fromDegrees(longitude, latitude, 100000);

        const positionCartographic = new Cesium.Cartographic(
            longitude,
            latitude,
            height * 0.5
        );
        const position = this._earth.scene.globe.ellipsoid.cartographicToCartesian(
            positionCartographic
        );

        const camera = this._earth.scene.camera;
        const heading = camera.heading;
        const pitch = camera.pitch;

        const offset = this.offsetFromHeadingPitchRange(
            heading,
            pitch,
            height * 2.0
        );

        const transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        Cesium.Matrix4.multiplyByPoint(transform, offset, position);

        camera.flyTo({
            destination: position,
            orientation: {
                heading: heading,
                pitch: pitch,
            },
            easingFunction: Cesium.EasingFunction.QUADRATIC_OUT,
        });
    }

    offsetFromHeadingPitchRange(heading, pitch, range) {
        pitch = Cesium.Math.clamp(
            pitch,
            -Cesium.Math.PI_OVER_TWO,
            Cesium.Math.PI_OVER_TWO
        );
        heading = Cesium.Math.zeroToTwoPi(heading) - Cesium.Math.PI_OVER_TWO;

        const pitchQuat = Cesium.Quaternion.fromAxisAngle(
            Cesium.Cartesian3.UNIT_Y,
            -pitch
        );
        const headingQuat = Cesium.Quaternion.fromAxisAngle(
            Cesium.Cartesian3.UNIT_Z,
            -heading
        );
        const rotQuat = Cesium.Quaternion.multiply(
            headingQuat,
            pitchQuat,
            headingQuat
        );
        const rotMatrix = Cesium.Matrix3.fromQuaternion(rotQuat);

        const offset = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_X);
        Cesium.Matrix3.multiplyByVector(rotMatrix, offset, offset);
        Cesium.Cartesian3.negate(offset, offset);
        Cesium.Cartesian3.multiplyByScalar(offset, range, offset);
        return offset;
    }


}