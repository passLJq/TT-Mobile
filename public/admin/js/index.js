$(function (){
    //表格1
    var myChart = echarts.init(document.querySelector('.chart'));
    var option = {
        backgroundColor: '',

        title: {
            text: '品牌销售排行',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#ccc'
            }
        },

        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
                colorLightness: [0, 1]
            }
        },
        series : [
            {
                name:'销售排行',
                type:'pie',
                radius : '55%',
                center: ['50%', '50%'],
                data:[
                    {value:335, name:'耐克'},
                    {value:310, name:'阿迪达斯'},
                    {value:274, name:'新百伦'},
                    {value:235, name:'安踏'},
                    {value:400, name:'回力'}
                ].sort(function (a, b) { return a.value - b.value; }),
                roseType: 'radius',
                label: {
                    normal: {
                        textStyle: {
                            color: 'rgba(0, 0, 0, 0.8)'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        lineStyle: {
                            color: 'rgba(0, 0, 0, 0.8)'
                        },
                        smooth: 0.2,
                        length: 10,
                        length2: 20
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#c23531',
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0,1)'
                    }
                },

                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };

    myChart.setOption(option);
    //表格2
    var chartTwo = echarts.init(document.querySelector('.chartTwo'));
    var optionTwo = {
        title:{
            text:'月销售总额',
            subtext: '单位:万'
        },
        xAxis: {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月','八月','九月','十月','十一月','十二月']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320,587,963,1241,1523,1121],
            type: 'line'
        }]
    };
    chartTwo.setOption(optionTwo);


});