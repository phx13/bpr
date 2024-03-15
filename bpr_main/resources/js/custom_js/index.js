/**
 * 首页脚本
 * author：phx
 */

/**
 * 初始化首页终端情况图表
 */
function initTerminalIndexChart() {
    // 基于准备好的dom，初始化echarts实例
    let terminalIndexChart = echarts.init(document.getElementById('terminalIndexChart'), 'dark');

    // 指定图表的配置项和数据
    let terminalIndexChartOption = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: '终端在线情况',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 30,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 60, name: '在线数量'},
                    {value: 40, name: '离线数量'}
                ]
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    terminalIndexChart.setOption(terminalIndexChartOption);
}

initTerminalIndexChart();

/**
 * 初始化首页设备情况图表
 */
function initEquipmentIndexChart() {
    // 基于准备好的dom，初始化echarts实例
    let equipmentIndexChart = echarts.init(document.getElementById('equipmentIndexChart'), 'dark');

    // 指定图表的配置项和数据
    let equipmentIndexChartOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // Use axis to trigger tooltip
                type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            }
        },
        legend: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: ['蓝牙基站', 'LoRa基站', '北斗数传']
        },
        series: [
            {
                name: '在线数量',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [15, 4, 1]
            },
            {
                name: '离线数量',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [5, 2, 0]
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    equipmentIndexChart.setOption(equipmentIndexChartOption);
}

initEquipmentIndexChart();