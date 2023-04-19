// let map = initMap([120, 38], 6);
// let earth = initEarth()


const url = 'http://127.0.0.1:6677/{z}/{x}/{y}.png'; //地图服务地址
let mapManager = new MapManager();
mapManager.initialize(url, 120, 38, 6);
let earthManager = new EarthManager();
earthManager.initialize(url, 120, 20, 3500000);

let map = mapManager.getMap();
let earth = earthManager.getViewer();

console.log(map);
console.log(earth);