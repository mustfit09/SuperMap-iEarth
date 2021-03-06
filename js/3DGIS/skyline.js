define(['Cesium','echartsMin'],function(Cesium,echartsMin) {
    'use strict';
    var skyLine = function () {
    };
    var skyline;
    var parent;
    skyLine.initializing = function(viewer,parentContainer){
        var scene = viewer.scene;
        parent =  parentContainer
        if(!skyline){
            skyline = new Cesium.Skyline(scene);
        }
        var cartographic = scene.camera.positionCartographic;
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        var height = cartographic.height;
        //天际线分析的视口位置设置成当前相机位置
        skyline.viewPosition = [longitude, latitude, height];
        $('#skyviewX').val(longitude.toFixed(4));
        $('#skyviewY').val(latitude.toFixed(4));
        $('#skyviewZ').val(height.toFixed(4));
        //设置俯仰和方向
        skyline.pitch = Cesium.Math.toDegrees(scene.camera.pitch);
        skyline.direction = Cesium.Math.toDegrees(scene.camera.heading);
        skyline.radius = parseFloat($("#skylineRadius").val());
        skyline.build();

        var skylineColor = document.getElementById('skylineColor');
        skylineColor.oninput = function(){
            var color = Cesium.Color.fromCssColorString(skylineColor.value);
            skyline.color = color;
        };
        $('#skylineMode').change(function(){
            var value = $(this).val();
            if(value=="0"){
                skyline.displayStyle = 0;
            }
            else if(value=="1"){
                skyline.displayStyle = 1;
            }
        });

        $('#clearSkyline').click(function(){
            viewer.entities.removeAll();
            if(parent.skylineForm){
                parent.skylineForm.$el.hide();
            }
            skyline.clear();
        });

        document.getElementById("getSkyline2D").onclick = function() {
            var object = skyline.getSkyline2D();
            var me = parent;
            if(parent.skylineForm){
                var myChart = echarts.init(document.getElementById("map"));
                var option = {
                    backgroundColor : "rgba(73,139,156,0.0)",
                    tooltip : {
                        trigger : "axis"
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : "category",
                            boundaryGap : false,
                            data : object.x,
                            show : false
                        }
                    ],
                    yAxis : [
                        {
                            type : "value",
                            min : 0,
                            max : 1,
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        }
                    ],
                    series : [
                        {
                            name : "",
                            type : "line",
                            data : object.y
                        }
                    ]
                }
                myChart.setOption(option);
                parent.skylineForm.$el.show();
            }else {
                require(['./views/skylineForm'], function (skylineForm) {
                    var skylineForm = new skylineForm({
                        object: object,
                        sceneModel: me.model,
                        isPCBroswer: me.isPCBroswer
                    });
                    me.parent.addComponent(skylineForm);
                    me.skylineForm = skylineForm;
                    skylineForm.$el.show();
                });
            }


        }
    }
    skyLine.remove = function(viewer){
        if(skyline){
            skyline.destroy();
            skyline = undefined;
        }
    };
    return skyLine;
});
