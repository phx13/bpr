/**
 * 场景管理类
 * author：phx
 */

import * as THREE from '../import_js/three.module.js'
import {OrbitControls} from "../import_js/OrbitControls.js";

class SceneManager {
    constructor() {
    }

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
     * 创建渲染器
     * @param color 背景颜色
     * @param alpha 透明度
     * @param container 渲染容器
     * @returns {WebGLRenderer} 渲染器实体
     */
    createRenderer(color, alpha, container) {
        let renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(color, alpha);
        renderer.setSize(container.offsetWidth, container.offsetHeight);
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
     * 更新网格大小
     * @param mesh 网格
     * @param width 宽
     * @param height 高
     * @param depth 长
     */
    updateMeshScale(mesh, width, height, depth) {
        mesh.scale.set(width, height, depth);
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
        controls.maxPolarAngle = Math.PI / 2;
        return controls;
    }
}

export {SceneManager}