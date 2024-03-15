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
    let camera = sceneManager.createCamera(60, (sceneContainer.offsetWidth) / (sceneContainer.offsetHeight), 0.1, 1000);
    camera.position.set(0, 70, 70);
    camera.lookAt(scene.position);

    // 创建渲染器
    let renderer = sceneManager.createRenderer(0xadd8e6, 1, sceneContainer);
    sceneContainer.appendChild(renderer.domElement);

    // 创建地面
    // let planeGeometry = sceneManager.GEOMETRYTYPE.BOX;
    // let planeMaterial = sceneManager.MATERIALTYPE.LAMBERT;
    // let planeMesh = sceneManager.createMesh(planeGeometry, planeMaterial, 'plane');
    // planeMesh.scale.set(160, 20, 1);
    // scene.add(planeMesh);

    // 添加轨道控制器
    let orbitControls = sceneManager.createOrbitControls(camera, renderer, sceneContainer);

    // 增加环境光源
    let ambientLight = sceneManager.LIGHTTYPE.AMBIENT;
    scene.add(ambientLight);

    // 增加点光源
    let spotLight = sceneManager.LIGHTTYPE.SPOT;
    spotLight.position.set(0, 1000, 0);
    scene.add(spotLight);

    // 创建蓝牙基站实体组
    let bluetoothGroup = sceneManager.createGroup('蓝牙基站组');
    scene.add(bluetoothGroup);

    // 创建终端实体组
    let terminalGroup = sceneManager.createGroup('终端组');
    scene.add(terminalGroup);

    // 创建模型读取器
    let gltfLoader = sceneManager.createGLTFLoader();
    // 船体模型
    let boardModelUrl = '../../models/chuan.glb';
    // 蓝牙基站模型
    let bluetoothModelUrl = '../../models/bluetooth.glb';
    // 终端模型
    let terminalModelUrl = '../../models/shoubiao.glb';
    // 终端更新定时器
    let terminalInterval;

    // 加载船体模型
    gltfLoader.load(boardModelUrl, function (model) {
        model.scene.name = 'boardplane';
        model.scene.scale.set(4, 4, 4);
        model.scene.position.set(0, 0, 0);
        // model.scene.material.color.set(0x808080);
        // model.scene.rotation.y = Math.PI / 2;
        // 将基站模型添加到蓝牙基站实体组
        scene.add(model.scene);
    })

    // 创建全局控制器
    let globalController = sceneManager.createUIController(sceneContainer, '全局控制器', '17em', '6em');
    // 全局控制器中的操作
    let globalControllerObjects = {
        // 加载蓝牙基站方法
        loadBluetoothController: function () {
            // 首先清除蓝牙基站列表
            globalControllerObjects.clearBluetoothController();
            // 调用后端接口获取当前舰船的所有蓝牙基站
            request.get(loadBluetoothListUrl).then(res => {
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
                        $('#bluetoothPositionX').text('X坐标： ' + bluetooth['position_x']);
                        $('#bluetoothPositionY').text('Y坐标： ' + bluetooth['position_y']);
                        $('#bluetoothPositionZ').text('Z坐标： ' + bluetooth['position_z']);
                        camera.position.set(bluetooth['position_x'], bluetooth['position_y'] + 20, bluetooth['position_z'] + 5);
                        sceneManager.updateCameraTarget(orbitControls, bluetooth['position_x'], bluetooth['position_y'], bluetooth['position_z'])
                    }
                    // 将蓝牙基站点击方法添加到基站列表
                    bluetoothController.add(bluetoothControllerObjects, bluetooth['bluetooth_id']).name('蓝牙基站 ' + bluetooth['bluetooth_id']);
                    // 加载蓝牙基站模型
                    gltfLoader.load(bluetoothModelUrl, function (model) {
                        model.scene.name = bluetooth['bluetooth_id'];
                        model.scene.position.set(bluetooth['position_x'], bluetooth['position_y'], bluetooth['position_z']);
                        // model.scene.scale.set(0.1, 0.1, 0.1);
                        // model.scene.rotation.y = Math.PI / 2;
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
                    $('#bluetoothPositionX').text('X坐标： ');
                    $('#bluetoothPositionY').text('Y坐标： ');
                    $('#bluetoothPositionZ').text('Z坐标： ');
                }
            })
        },
        // 加载终端方法
        loadTerminalController: function () {
            // 首先清除终端列表
            globalControllerObjects.clearTerminalController();
            // 创建终端列表
            let terminalController = globalController.addFolder('终端列表');
            // 创建终端操作
            let terminalControllerObjects = {};
            // 调用后端接口获取当前舰船的所有终端
            request.get(loadOnlineTerminalListUrl).then(res => {
                for (const [terminal, position] of Object.entries(res.data)) {
                    // 创建终端点击方法
                    terminalControllerObjects[terminal] = function () {
                        // 更新终端信息
                        globalControllerObjects.updateTerminalInfoMethod(terminal, position);
                    }
                    // 将终端点击方法添加到终端列表
                    terminalController.add(terminalControllerObjects, terminal).name('终端 ' + terminal);
                    // 加载终端模型
                    gltfLoader.load(terminalModelUrl, function (model) {
                        model.scene.name = terminal;
                        model.scene.position.set(position[1], position[2], position[3]);
                        // model.scene.scale.set(1, 1, 0.1);
                        // 将基站模型添加到蓝牙基站实体组
                        terminalGroup.add(model.scene);
                    })
                }
            })
            // 更新数据
            terminalInterval = setInterval(function () {
                request.get(loadOnlineTerminalListUrl).then(res => {
                    for (const [terminal, position] of Object.entries(res.data)) {
                        // 将获取到的终端信息添加到终端信息历史数据中
                        let param = "terminalId=" + terminal;
                        param += "&terminalPositionX=" + position[1];
                        param += "&terminalPositionY=" + position[2];
                        param += "&terminalPositionZ=" + position[3];
                        $.post('/terminal/online_terminal_indoor_info', param, function (data) {

                        })
                        // 更新终端点击方法
                        terminalControllerObjects[terminal] = function () {
                            // 更新终端信息
                            globalControllerObjects.updateTerminalInfoMethod(terminal, position);
                        }
                        // 如果终端不在当前列表里
                        if (!(terminal in terminalControllerObjects)) {
                            // 将终端点击方法添加到终端列表
                            terminalController.add(terminalControllerObjects, terminal).name('终端 ' + terminal);
                            // 加载终端模型
                            gltfLoader.load(terminalModelUrl, function (model) {
                                model.scene.name = terminal;
                                model.scene.position.set(position[1], position[2], position[3]);
                                // model.scene.scale.set(0.1, 0.1, 0.1);
                                // 将终端模型添加到终端实体组
                                terminalGroup.add(model.scene);
                            })
                        } else {
                            let mesh = terminalGroup.getObjectByName(terminal);
                            mesh.position.set(position[1], position[2], position[3]);
                        }
                    }
                })
            }, 1000);
        },
        // 更新终端信息方法
        updateTerminalInfoMethod: function (terminal, position) {
            // 更新终端信息
            $('#terminalId').text('终端号： ' + terminal);
            $('#terminalPositionX').text('X坐标： ' + position[1]);
            $('#terminalPositionY').text('Y坐标： ' + position[2]);
            $('#terminalPositionZ').text('Z坐标： ' + position[3]);
        },
        // 清除终端方法
        clearTerminalController: function () {
            // 遍历全局控制器的文件夹
            globalController.folders.forEach(function (folder) {
                // 找到蓝牙基站文件夹
                if (folder._title === "终端列表") {
                    // 清除定时器
                    clearInterval(terminalInterval);
                    // 清除场景中的蓝牙基站实体
                    folder.children.forEach(function (entity) {
                        terminalGroup.remove(terminalGroup.getObjectByName(entity.property));
                    })
                    // 清除文件夹
                    folder.destroy();
                    // 清除蓝牙基站信息
                    $('#terminalId').text('终端号： ');
                    $('#terminalPositionX').text('X坐标： ');
                    $('#terminalPositionY').text('Y坐标： ');
                    $('#terminalPositionZ').text('Z坐标： ');
                }
            })
        },
    }
    // 将加载蓝牙基站方法添加到全局控制器
    globalController.add(globalControllerObjects, 'loadBluetoothController').name('获取蓝牙基站列表');
    // 将清除蓝牙基站方法添加到全局控制器
    globalController.add(globalControllerObjects, 'clearBluetoothController').name('清除蓝牙基站列表');
    // 将加载终端方法添加到全局控制器
    globalController.add(globalControllerObjects, 'loadTerminalController').name('获取终端列表');
    // 将清除终端方法添加到全局控制器
    globalController.add(globalControllerObjects, 'clearTerminalController').name('清除终端列表');

    // 窗口改变刷新场景事件
    // window.onresize = function () {
    //     camera.aspect = sceneContainer.offsetWidth / sceneContainer.offsetHeight;
    //     camera.updateProjectionMatrix();
    //     renderer.setSize(sceneContainer.offsetWidth, sceneContainer.offsetHeight);
    // };

    // 渲染场景
    renderScene();

    function renderScene() {
        // 递归渲染
        requestAnimationFrame(renderScene);
        orbitControls.update();
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    }
}

window.onload = init;