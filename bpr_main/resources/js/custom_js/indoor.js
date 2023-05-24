/**
 * 室内定位页脚本
 * author：phx
 */
import {SceneManager} from "./sceneManager.js";

let sceneManager = new SceneManager();

// 当页面加载完毕后，调用此函数，初始化画面
function init() {
    // 获取容器
    let sceneContainer = document.getElementById('scene');

    // 创建场景
    let scene = sceneManager.createScene();

    // 创建相机
    let camera = sceneManager.createCamera(45, sceneContainer.offsetWidth / sceneContainer.offsetHeight, 0.1, 1000);
    camera.position.set(40, 40, 10);
    camera.lookAt(scene.position);

    // 创建渲染器
    let renderer = sceneManager.createRenderer(0xdddddd, 1, sceneContainer);
    sceneContainer.appendChild(renderer.domElement);

    // 创建地面
    let planeGeometry = sceneManager.GEOMETRYTYPE.BOX;
    let planeMaterial = sceneManager.MATERIALTYPE.LAMBERT;
    let planeMesh = sceneManager.createMesh(planeGeometry, planeMaterial, 'plane');
    planeMesh.scale.set(20, 20, 1);
    scene.add(planeMesh);

    // 添加轨道控制器
    let orbitControls = sceneManager.createOrbitControls(camera, renderer, sceneContainer);

    // 增加环境光源
    let ambientLight = sceneManager.LIGHTTYPE.AMBIENT;
    scene.add(ambientLight);

    // 增加点光源
    let spotLight = sceneManager.LIGHTTYPE.SPOT;
    spotLight.position.set(-40, 60, -10);
    scene.add(spotLight);

    // 创建蓝牙基站实体组
    let bluetoothGroup = sceneManager.createGroup('蓝牙基站组');
    scene.add(bluetoothGroup);

    // 创建模型读取器
    let gltfLoader = sceneManager.createGLTFLoader();
    // 蓝牙基站模型
    let bluetoothModelUrl = '../../models/bluetooth.glb';

    // 创建全局控制器
    let globalController = sceneManager.createUIController(sceneContainer, '全局控制器', '15em', '45em');
    // 全局控制器中的操作
    let globalControllerObjects = {
        // 加载蓝牙基站方法
        loadBluetoothController: function () {
            // 首先清除蓝牙基站列表
            globalControllerObjects.clearBluetoothController();
            // 调用后端接口获取当前舰船的所有蓝牙基站
            axios.get(loadBluetoothListUrl).then(res => {
                // 创建蓝牙基站列表
                let bluetoothController = globalController.addFolder('蓝牙基站列表');
                // 创建蓝牙基站操作
                let bluetoothControllerObjects = {};
                // 遍历所有蓝牙基站
                res.data.forEach((bluetooth) => {
                    // 创建蓝牙基站点击方法
                    bluetoothControllerObjects[bluetooth['bluetooth_id']] = function () {
                        // 更新蓝牙基站信息
                        $('#bluetoothId').text('蓝牙基站号： ' + bluetooth['bluetooth_id']);
                        $('#positionX').text('X坐标： ' + bluetooth['position_x']);
                        $('#positionY').text('Y坐标： ' + bluetooth['position_y']);
                        $('#positionZ').text('Z坐标： ' + bluetooth['position_z']);
                    }
                    // 将蓝牙基站点击方法添加到基站列表
                    bluetoothController.add(bluetoothControllerObjects, bluetooth['bluetooth_id']).name('蓝牙基站 ' + bluetooth['bluetooth_id']);
                    // 加载蓝牙基站模型
                    gltfLoader.load(bluetoothModelUrl, function (model) {
                        model.scene.name = bluetooth['bluetooth_id'];
                        model.scene.position.set(bluetooth['position_x'], bluetooth['position_y'], bluetooth['position_z']);
                        // 将基站模型添加到蓝牙基站实体组
                        bluetoothGroup.add(model.scene);
                    })
                })
            })
        },
        // 清除蓝牙基站方法
        clearBluetoothController: function () {
            // 遍历全局控制器的文件夹
            globalController.folders.forEach(function (folder) {
                // 找到蓝牙基站文件夹
                if (folder._title === "蓝牙基站列表") {
                    // 清除场景中的蓝牙基站实体
                    folder.children.forEach(function (entity) {
                        bluetoothGroup.remove(bluetoothGroup.getObjectByName(entity.property));
                    })
                    // 清除文件夹
                    folder.destroy();
                    // 清除蓝牙基站信息
                    $('#bluetoothId').text('蓝牙基站号： ');
                    $('#positionX').text('X坐标： ');
                    $('#positionY').text('Y坐标： ');
                    $('#positionZ').text('Z坐标： ');
                }
            })
        }
    }
    // 将加载蓝牙基站方法添加到全局控制器
    globalController.add(globalControllerObjects, 'loadBluetoothController').name('获取蓝牙基站列表');
    // 将清除蓝牙基站方法添加到全局控制器
    globalController.add(globalControllerObjects, 'clearBluetoothController').name('清除蓝牙基站列表');

    globalController.addFolder('甲板');
    globalController.addFolder('甲板控制器');

    // 渲染场景
    renderScene();

    function renderScene() {
        // 递归渲染
        requestAnimationFrame(renderScene);
        orbitControls.update();
        renderer.render(scene, camera);
    }

    // emitter.on('bluetoothInfo', (bluetooth) => {
    //
    // })
}

window.onload = init;