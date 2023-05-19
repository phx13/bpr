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
    camera.position.set(10, 10, 10);
    camera.lookAt(scene.position);
    // 创建渲染器
    let renderer = sceneManager.createRenderer(0xdddddd, 1, sceneContainer);
    sceneContainer.appendChild(renderer.domElement);

    // 创建地面
    let planeGeometry = sceneManager.GEOMETRYTYPE.BOX;
    let planeMaterial = sceneManager.MATERIALTYPE.LAMBERT;
    let planeMesh = sceneManager.createMesh(planeGeometry, planeMaterial, 'plane');
    sceneManager.updateMeshScale(planeMesh, 5, 5, 2);
    // 将地面添加到场景中
    scene.add(planeMesh);

    // 添加轨道控制器
    let orbitControls = sceneManager.createOrbitControls(camera, renderer, sceneContainer);

    // 增加环境光源
    let ambientLight = sceneManager.LIGHTTYPE.AMBIENT;
    scene.add(ambientLight);

    // 增加点光源
    let spotLight = sceneManager.LIGHTTYPE.SPOT;
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    let globalController = sceneManager.createUIController(sceneContainer,'全局控制器','15em','45em');
    globalController.addFolder('甲板');
    globalController.addFolder('甲板控制器');

    let globalController1 = sceneManager.createUIController(sceneContainer,'全局控制器','15em','45em');
    globalController1.addFolder('甲板');
    globalController1.addFolder('甲板控制器');

    // 渲染【场景】
    renderScene();

    function renderScene() {
        // 递归渲染
        requestAnimationFrame(renderScene);
        orbitControls.update();
        renderer.render(scene, camera);
    }
}

window.onload = init;