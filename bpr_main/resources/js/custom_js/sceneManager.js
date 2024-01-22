/**
 * 场景管理类
 * author：phx
 */

import * as THREE from '../import_js/three.module.js'
import {OrbitControls} from "../import_js/OrbitControls.js";
import {GLTFLoader} from "../import_js/GLTFLoader.js";
import {GUI} from "../import_js/lil-gui.module.min.js";

class SceneManager {
    /**
     * 几何体类型
     */
    GEOMETRYTYPE = {
        BOX: new THREE.BoxGeometry(1, 1, 1),//立方体
        CIRCLE: new THREE.CircleGeometry(5, 32),//圆形
        CONE: new THREE.ConeGeometry(5, 20, 32),//锥形
        PLANE: new THREE.PlaneGeometry(1, 1)//矩形
    }

    /**
     * 几何体类型
     */
    MATERIALTYPE = {
        BASIC: new THREE.MeshBasicMaterial({color: 0xffffff}),//基础材质
        LAMBERT: new THREE.MeshLambertMaterial({color: 0xffffff}),//Lambert材质
        STANDARD: new THREE.MeshStandardMaterial({color: 0xffffff}),//标准材质
        PHYSICAL: new THREE.MeshPhysicalMaterial({color: 0xffffff})//物理材质
    }

    /**
     * 光类型
     */
    LIGHTTYPE = {
        AMBIENT: new THREE.AmbientLight(0xffffff),//环境光
        SPOT: new THREE.SpotLight(0xffffff)//点光
    }

    constructor() {
    }

    /**
     * 创建一个空的三维场景
     * @returns {Scene} 空的场景
     */
    createScene() {
        return new THREE.Scene();
    }

    /**
     * 创建摄像机
     * @param fov 摄像机视锥体垂直视野角度
     * @param aspect 摄像机视锥体长宽比
     * @param near 摄像机视锥体近端面
     * @param far 摄像机视锥体远端面
     * @returns {PerspectiveCamera} 摄像机实体
     */
    createCamera(fov, aspect, near, far) {
        return new THREE.PerspectiveCamera(fov, aspect, near, far);
    }

    /**
     * 更新相机视角
     * @param orbitControls 滑轨控制器
     * @param x 目标x坐标
     * @param y 目标y坐标
     * @param z 目标z坐标
     */
    updateCameraTarget(orbitControls, x, y, z) {
        orbitControls.target = new THREE.Vector3(x, y, z);
        orbitControls.update();
    }

    /**
     * 创建渲染器
     * @param color 背景颜色
     * @param alpha 透明度
     * @param container 渲染容器
     * @returns {WebGLRenderer} 渲染器实体
     */
    createRenderer(color, alpha, container) {
        let renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(color, alpha);
        renderer.setSize(container.offsetWidth - 120, container.offsetHeight - 120);
        renderer.shadowMapEnabled = true;
        return renderer;
    }

    /**
     * 创建网格
     * @param geometry 几何体
     * @param material 材质
     * @param name 网格名字
     * @returns {Mesh} 网格
     */
    createMesh(geometry, material, name) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = name;
        return mesh;
    }

    /**
     * 创建组
     * @param name 组名字
     * @returns {Group} 组
     */
    createGroup(name) {
        const group = new THREE.Group();
        group.name = name;
        return group;
    }

    /**
     * 创建轨道控制器
     * @param camera 相机
     * @param renderer 渲染器
     * @param container 容器
     */
    createOrbitControls(camera, renderer, container) {
        let controls = new OrbitControls(camera, renderer.domElement);
        controls.listenToKeyEvents(container);
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 10;
        controls.maxDistance = 500;
        controls.maxPolarAngle = Math.PI;
        return controls;
    }

    /**
     * 创建控制器
     * @param container 所属容器
     * @param title 控制器标题
     * @param top 上边距
     * @param left 左边距
     * @returns {g} 控制器实体
     */
    createUIController(container, title, top, left) {
        const UIController = new GUI({container: container, title: title});
        UIController.domElement.style.position = "absolute";
        UIController.domElement.style.top = top;
        UIController.domElement.style.left = left;
        return UIController;
    }

    /**
     * 创建模型加载器
     * @returns {GLTFLoader} 模型加载器
     */
    createGLTFLoader() {
        return new GLTFLoader();
    }
}

export {SceneManager}