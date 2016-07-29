import * as d3 from "d3";
import _ from 'lodash';

import MqttLoadSettingsService from '../../services/MqttLoadSettingsService';
import CommonUtils from '../../utils/CommonUtils';

class LoadDataGraph {

    constructor() {
        this.getMqttLoadDataByInstanceIds = this.getMqttLoadDataByInstanceIds.bind(this);
        this.processGraphData = this.processGraphData.bind(this);
        this.plotGraph = this.plotGraph.bind(this);
        this.startGraphProcess = this.startGraphProcess.bind(this);
        this.onSamplingButtonClick = this.onSamplingButtonClick.bind(this);
        this.graphData = [];
        this.startGraphProcess(null);
        this.x = null;
        this.y = null;
        this.z = null;
        this.instanceNames = [];

        document.getElementById('samplingButton').addEventListener('click', this.onSamplingButtonClick, false);
    }

    onSamplingButtonClick() {
        var sampRate =parseInt(document.getElementById('sampling').value);
        if(sampRate!=null && sampRate>0) {
            CommonUtils.openWindow("./loadgraph.html?iids="+CommonUtils.getUrlQueryParameter(location.search,'iids')+'&sr='+sampRate,"_self");
        }
    }

    startGraphProcess() {
        var iId = CommonUtils.getUrlQueryParameter(location.search,'iids');
        var samplingRate = CommonUtils.getUrlQueryParameter(location.search,'sr');

        var iIds = iId.split(',');
        if(typeof(iIds)!='undefined' && iIds!=null && iIds.length>0) {
            this.getMqttLoadDataByInstanceIds(iIds,samplingRate);
        }
    }

    getMqttLoadDataByInstanceIds(iIds,samplingRate) {
        var loadDataObjList = [];
        MqttLoadSettingsService.getMqttLoadDataByInstanceIds(iIds)
        .then(function(loadDataList) {
            var allLoadDataMessages = [];
            if(loadDataList.length>1) {
                for(var i=0;i<loadDataList.length;i++) {
                    if(loadDataList[i]!=null && loadDataList[i].receivedMessages!=null && loadDataList[i].receivedMessages.length>0) {
                        allLoadDataMessages = allLoadDataMessages.concat(loadDataList[i].receivedMessages);
                        loadDataObjList.push(loadDataList[i]);
                    }
                }
                allLoadDataMessages = _.sortBy(allLoadDataMessages, function(obj) { return obj.time;});
                loadDataObjList.push({metaData:{name:'All Data'},receivedMessages:allLoadDataMessages});
            } else if(loadDataList.length==1 && loadDataList[0].receivedMessages.length>0){
                allLoadDataMessages = loadDataList[0].receivedMessages;
                loadDataObjList.push(loadDataList[0]);
            }

            if(allLoadDataMessages.length>1) {
                if(samplingRate==null || samplingRate<=0) {
                    samplingRate = Math.floor(allLoadDataMessages.length/loadDataObjList.length);
                }
                this.processGraphData(loadDataObjList,allLoadDataMessages,samplingRate);
            } else {
                document.getElementById("noDataAvailable").style.display = 'inline';
            }
        }.bind(this));
    }

    processGraphData(loadDataList,allLoadDataMessages,samplingRate) {
        if(samplingRate <=2) {
            samplingRate = 5;
        }

        var minTime = Math.floor(_.minBy(allLoadDataMessages, function(o){ return o.time;}).time);
        var maxTime = Math.floor(_.maxBy(allLoadDataMessages, function(o){ return o.time;}).time);
        var timeSample = Math.floor((maxTime - minTime)/samplingRate);
        var timeSlices = [];
        var maxMessCnt = 0;
        for(var i=minTime;i<=maxTime;i=i+timeSample) {
            timeSlices.push(i);
        }

        for(var i=0;i<loadDataList.length;i++) {
            this.instanceNames.push(loadDataList[i].metaData.name);
            var receivedMessages = _.sortBy(loadDataList[i].receivedMessages,function(obj) {return obj.time;});
            var timeData = [];

            for(var j =0;j<timeSlices.length;j++) {
                var messsObs = _.filter(receivedMessages, function(o) { return (o.time>=timeSlices[j] && o.time<timeSlices[j+1]);});
                timeData.push({cnt:Number(messsObs.length),time:new Date(timeSlices[j])});
                if(messsObs.length>maxMessCnt) {
                    maxMessCnt = messsObs.length;
                }
            }
            this.graphData.push(timeData);

        }
        document.getElementById('sampling').value = samplingRate;
        this.plotGraph(maxTime,minTime,maxMessCnt);
    }

    plotGraph(maxTime,minTime,maxMessCnt) {
        var bandPos = [-1, -1];
        var pos;
        var xdomain = new Date(maxTime);
        var ydomain = maxMessCnt;

        var colors = ["DarkBlue", "DarkGreen","DarkRed","OrangeRed","Gold","Black","Violet"];
        var margin = {top: 40,right: 40,bottom: 50,left: 60}
        var width = window.innerWidth-(window.innerWidth*.1) - margin.left - margin.right;
        var height = window.innerHeight-(window.innerHeight*.3) - margin.top - margin.bottom;
        var zoomArea = {x1:new Date(minTime),y1:0,x2:xdomain,y2:ydomain};
        var drag = d3.behavior.drag();
        var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.x = d3.time.scale().range([0, width]);
        this.y = d3.scale.linear().range([height, 0]);
        var x = this.x.domain([new Date(minTime),xdomain]);
        var y = this.y.domain([0, ydomain]);

        var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format("%S:%L"));
        var yAxis = d3.svg.axis().scale(y).orient("left");

        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) {
                return x(d.time);
            })
            .y(function(d) {
                return y(d.cnt);
            });

        var band = svg.append("rect").attr("width", 0).attr("height", 0)
            .attr("x", 0).attr("y", 0).attr("class", "band");
        svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis)
            .append("text").attr("class", "label").attr("x", width).attr("y", -6).style("text-anchor", "end").text("Time");
        svg.append("g").attr("class", "y axis").call(yAxis)
            .append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Number of messages");
        svg.append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);

        for (var idx in this.graphData) {
          svg.append("path")
            .datum(this.graphData[idx])
            .attr("class", "line line" + idx)
            .attr("clip-path", "url(#clip)")
            .style("stroke", colors[idx])
            .attr("d", line);
        }

        function zoom() {
            if (zoomArea.x1 > zoomArea.x2) {
                x.domain([zoomArea.x2, zoomArea.x1]);
            } else {
                x.domain([zoomArea.x1, zoomArea.x2]);
            }

            if (zoomArea.y1 > zoomArea.y2) {
                y.domain([zoomArea.y2, zoomArea.y1]);
            } else {
                y.domain([zoomArea.y1, zoomArea.y2]);
            }
            //update axis and redraw lines
            var t = svg.transition().duration(750);
            t.select(".x.axis").call(xAxis);
            t.select(".y.axis").call(yAxis);
            t.selectAll(".line").attr("d", line);
        }

        var zoomOut = function() {
            x.domain([new Date(minTime), xdomain]);
            y.domain([0, ydomain]);
            var t = svg.transition().duration(750);
            t.select(".x.axis").call(xAxis);
            t.select(".y.axis").call(yAxis);
            t.selectAll(".line").attr("d", line);
        }

        var legend = svg.selectAll(".legend")
            .data(this.instanceNames)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")";});

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill",function(d,i){return colors[i];});

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d){return d;});

        var zoomOverlay = svg.append("rect")
            .attr("width", width - 10)
            .attr("height", height)
            .attr("class", "zoomOverlay")
            .call(drag);

        var zoomout = svg.append("g");

        zoomout.append("rect")
            .attr("class", "zoomOut")
            .attr("width", 75)
            .attr("height", 40)
            .attr("x", -12)
            .attr("y", height + (margin.bottom - 20))
            .on("click", function() {
                zoomOut();
            });

        zoomout.append("text")
            .attr("class", "zoomOutText")
            .attr("width", 75)
            .attr("height", 30)
            .attr("x", -10)
            .attr("y", height + (margin.bottom - 5))
            .text("Zoom Out");

        zoom();
        drag.on("dragend", function() {
            var pos = d3.mouse(this);
            var x1 = x.invert(bandPos[0]);
            var x2 = x.invert(pos[0]);

            if (x1 < x2) {
                zoomArea.x1 = x1;
                zoomArea.x2 = x2;
            } else {
                zoomArea.x1 = x2;
                zoomArea.x2 = x1;
            }

            var y1 = y.invert(pos[1]);
            var y2 = y.invert(bandPos[1]);

            if (x1 < x2) {
                zoomArea.y1 = y1;
                zoomArea.y2 = y2;
            } else {
                zoomArea.y1 = y2;
                zoomArea.y2 = y1;
            }

            bandPos = [-1, -1];

            d3.select(".band").transition()
                .attr("width", 0)
                .attr("height", 0)
                .attr("x", bandPos[0])
                .attr("y", bandPos[1]);
            zoom();
        });

        drag.on("drag", function() {
            var pos = d3.mouse(this);
            if (pos[0] < bandPos[0]) {
                d3.select(".band").
                attr("transform", "translate(" + (pos[0]) + "," + bandPos[1] + ")");
            }
            if (pos[1] < bandPos[1]) {
                d3.select(".band").
                attr("transform", "translate(" + (pos[0]) + "," + pos[1] + ")");
            }
            if (pos[1] < bandPos[1] && pos[0] > bandPos[0]) {
                d3.select(".band").
                attr("transform", "translate(" + (bandPos[0]) + "," + pos[1] + ")");
            }

            //set new position of band when user initializes drag
            if (bandPos[0] == -1) {
                bandPos = pos;
                d3.select(".band").attr("transform", "translate(" + bandPos[0] + "," + bandPos[1] + ")");
            }

            d3.select(".band").transition().duration(1)
                .attr("width", Math.abs(bandPos[0] - pos[0]))
                .attr("height", Math.abs(bandPos[1] - pos[1]));
        });
    }
}

export default new LoadDataGraph();