var Baselayer;//底图
var map;//公共map
var popup;//弹出说明
var marker;//标记
var myIcon;//图标
var path = [];//路径
var currentEvent;//当前事件
var markers=[];//标记组
var id = 0;//id
var playAnimationCount = 0;//播放次数
var polylineGroup = L.layerGroup();//折线图层组
var c_index;//layer弹窗index
$(function () {
	//登录状态
	//first();
	//写入文件
	$(".importLimitssave").click(function () {
		// 创建一个要保存的数据对象
		var myData = currentEvent;
		// 使用 JSON.stringify 函数将对象转换为字符串
		var dataString = JSON.stringify(myData);
		// 创建一个 Blob 对象，用于存储数据字符串
		var dataBlob = new Blob([dataString], { type: "application/json" });
		// 创建一个 a 标签，用于触发下载
		var a = document.createElement("a");
		// 设置 a 标签的 href 属性为 Blob 对象的 URL
		a.href = URL.createObjectURL(dataBlob);
		// 设置 a 标签的 download 属性为要保存的文件名
		a.download = "data.json";
		// 将 a 标签添加到文档中
		document.body.appendChild(a);
		// 触发 a 标签的 click 事件，开始下载
		a.click();
		// 移除 a 标签和 Blob 对象的 URL
		document.body.removeChild(a);
		URL.revokeObjectURL(a.href);
	});
	//读取文件
	$(".importLimits").click(function () {
		$("#importLimits").click();
	});

	$("#importLimits").change(function () {
		var selectedFile = document.getElementById("importLimits").files[0];//获取读取的File对象
		var name = selectedFile.name;//读取选中文件的文件名
		var size = selectedFile.size;//读取选中文件的大小
		console.log("文件名:" + name + "大小：" + size);
		var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
		reader.readAsText(selectedFile);//读取文件的内容
		reader.onload = function () {
			console.log("读取结果：", this.result);//当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
			console.log("读取结果转为JSON：");
			let json = JSON.parse(this.result);
			let chname=json.chname;
			let id = json.id;
			if (id == "0" || id == currentEvent.id || chname == currentEvent.chname)
				layer.alert("事件已存在不能添加", { title: "错误", icon: 2 });
			else {
				currentEvent = json;
				$("#nowAction").append("<option value='" + currentEvent.id + "'>" + currentEvent.chname + "</option>");
				$("#nowAction").val(currentEvent.id );
			}
			$("#importLimits").val("");
		};
	})
	//绑定div的id（即地图在哪个div中展示），设置地图默认中心点和缩放级别，
	let mapUrlindex = $("#selectMap").val();
	let mapUrl = getUrl(mapUrlindex);
	map = L.map('map', {
		minZoom: 5,
		maxZoom: 9,
		zoomControl: false,
		attributionControl: false,

	}).setView([34.75868, 113.66077], 9);
	//1 禁止滚轮
	//map.scrollWheelZoom.disable();
	//1 禁止拖拽 
	//map.dragging.disable();
	//1 禁止双击缩放 
	map.doubleClickZoom.disable()
	//禁止编辑地图
	let noEdit = $("#noEdit").val();

	if (noEdit == "") {
		//document.cookie = "noEdit=" + escape(1);
		$("#noEdit").val(1);
	}
	//是否显示下方的文本框
	let bottomText = $("#bottomText").val();
	if (bottomText == "") {
		//document.cookie = "bottomText=" + escape(1);
		$("#bottomText").val(1);
	}
	/* 加载高德地图瓦片 */
	var basemapUrl = (mapUrlindex == "" ? "http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}" : mapUrl);
	Baselayer = L.tileLayer(basemapUrl, {
		maxZoom: 18,
		tileSize: 256,

	}).addTo(map);
	polylineGroup.addTo(map);
	currentEvent = getData("map", "eventdata") == "" ? yz : getData("map", eventdata);
	if (noEdit == "" || noEdit == "1") {
		let action = currentEvent.action;
		action.sort(function (a, b) { return a.time - b.time });
		map.setView(action[0].piont[0]["zb"], action[0].level);
		myIcon = L.icon({
			iconSize: [25, 25],
			iconUrl: 'consys/game/game_person/' + action[0].icon+".png",
		})
		marker = L.marker(action[0].piont[0]["zb"], { icon: myIcon }).addTo(map);
	}
	else {
	
		
	}
	map.on('click', onMapClick);

})
//播放当前事件
function playAnimation() {
	ToggleDropdown();

	//检查当前事件，如果是预制事件，调用预制数据
	if ( playAnimationCount == 0) {

		let action = currentEvent.action;
		if (action.length > 0) {
			action.sort(function (a, b) { return a.time - b.time });
/*			if (marker != null) marker.remove();
			if (path.length > 0) {
				for (let i = 0; i < path.length; i++)
					path[i].remove()
			};*/
			polylineGroup.clearLayers()
			myIcon = L.icon({
				iconSize: [25, 25],
				iconUrl: 'consys/game/game_person/' + action[0].icon + ".png",
			})
			map.setView(action[0].piont[0]["zb"], action[0].level);
			marker = L.marker(action[0].piont[0]["zb"], { icon: myIcon }).addTo(map);
			marker.bindPopup(action[0].chname).openPopup();

			actionTimeI(action, 0, 0, action[0].piont[0]["zb"]);
		}
		else {
			layer.alert("当前事件没有数据", { title: "错误", icon: 2 }); return false;
		}
		

	}  


}
//下拉菜单按钮是否可用
function goEdit(a) {
	if (!a) $(".edit").removeAttr("disabled").removeClass("disabled");
	else $(".edit").attr("disabled", true).addClass("disabled");
}
//循环播放当前事件
function actionTimeI(action, i, j, zb) {
	let latlngs = [];
	playAnimationCount++;
	if (action[i].icon!="")
	myIcon = L.icon({
		iconSize: [25, 25],
		iconUrl: 'consys/game/game_person/' + action[i].icon+".png" ,
	})
	if (i < action.length) {

		if (j < action[i].piont.length && j != action[i].piont.length - 1) {
			latlngs[0] = zb;
			latlngs[1] = action[i].piont[j]["zb"];
		if(j==0)	map.flyTo(action[i].piont[j]["zb"], action[i].level);
			marker.bindPopup(action[i].chname).openPopup();
			if (latlngs[0][0] != latlngs[1][0] && latlngs[0][1] != latlngs[1][1]) {
				//marker.slideTo(action[i].piont[j]["zb"], { duration: action[i].piont[j]["second"] * 1000, keepAtCenter: true })
				marker.remove();
				let polyline = L.motion.polyline(latlngs, { color: 'blue' }, {
					auto: true, // 自动开始动画
					duration: action[i].piont[j]["second"] * 1000, // 动画持续时间为5秒
					easing: L.Motion.Ease.linear // 动画策略为线性
				}, {
					removeOnEnd: false, // 动画结束后移除标记
					showMarker: true, // 动画开始时显示标记
					icon: myIcon // 使用自定义图标
				}).addTo(map);
				//path.push(polyline)
				polylineGroup.addLayer(polyline);
				marker = polyline.getMarker();

				marker.bindPopup(action[i].chname).openPopup();

			}
			if ($("#bottomText").val()== 1)showTipBox(action[i].chname, action[i].piont[j]["second"] * 1000);
			j++;
			setTimeout(() => { this.actionTimeI(action, i, j, latlngs[1]) }, action[i].piont[j-1]["second"] * 1000);
		
		}
		else if (j == action[i].piont.length - 1 && i != action.length-1) {
			latlngs[0] = zb;
			latlngs[1] = action[i].piont[j]["zb"];
			map.flyTo(action[i].piont[j]["zb"], action[i].level);
			
			if (latlngs[0][0] != latlngs[1][0] && latlngs[0][1] != latlngs[1][1]) {
				//marker.slideTo(action[i].piont[j]["zb"], { duration: action[i].piont[j]["second"] * 1000, keepAtCenter: true })
				marker.remove();
				let polyline=L.motion.polyline(latlngs, { color: 'blue' }, {
					auto: true, // 自动开始动画
					duration: action[i].piont[j]["second"] * 1000, // 动画持续时间为5秒
					easing: L.Motion.Ease.linear // 动画策略为线性
				}, {
					removeOnEnd: false, // 动画结束后移除标记
					showMarker: true, // 动画开始时显示标记
					icon: myIcon // 使用自定义图标
				}).addTo(map);
				//path.push(polyline)
				polylineGroup.addLayer(polyline);
				marker = polyline.getMarker();

				marker.bindPopup(action[i].chname).openPopup();
			}
			if ($("#bottomText").val() == 1)showTipBox(action[i].chname, action[i].piont[j]["second"] * 1000);
			i++;
			setTimeout(() => { this.actionTimeI(action, i, 0, latlngs[1]) }, action[i-1].piont[j]["second"] * 1000);
	
		}
		else if (j == action[i].piont.length - 1 && i == action.length - 1) {
			latlngs[0] = zb;
			latlngs[1] = action[i].piont[j]["zb"];
		//	map.flyTo(action[i].piont[j]["zb"], action[i].level);
			if (latlngs[0][0] != latlngs[1][0] && latlngs[0][1] != latlngs[1][1]) {
				//marker.slideTo(action[i].piont[j]["zb"], { duration: action[i].piont[j]["second"] * 1000, keepAtCenter: true })
				marker.remove();
				let polyline = L.motion.polyline(latlngs, { color: 'blue' }, {
					auto: true, // 自动开始动画
					duration: action[i].piont[j]["second"] * 1000, // 动画持续时间为5秒
					easing: L.Motion.Ease.linear // 动画策略为线性
				}, {
					removeOnEnd: false, // 动画结束后移除标记
					showMarker: true, // 动画开始时显示标记
					icon: myIcon // 使用自定义图标
				}).addTo(map);
				//path.push(polyline)
				polylineGroup.addLayer(polyline);
				marker = polyline.getMarker();

				marker.bindPopup(action[i].chname).openPopup();
			}
			if ($("#bottomText").val() == 1) showTipBox(action[i].chname, action[i].piont[j]["second"] * 1000);
			playAnimationCount = 0;
		}

	}
}
// 上传事件
function upload() {
	//if ($("#nowAction").val() == 0) { layer.alert("默认事件不能上传", { title: "错误", icon: 2 }); return false; }
	if ($("#dengluzhuangtai").html() == "未登录") dengluNext();
	var data = {
		action: "updataMap",
		data: JSON.stringify(currentEvent).replace('%0D%0A', '\\r\\n')
	}
	toAjaxCRUDCallBack(service, data, function (result) {

		if (result == 1) {
			layer.alert("上传成功", { title: "消息", icon: 0 })

		}

	})
}
//登录
function denglu() {
	if ($("#dengluzhuangtai").html() == "已登录") exit()
	else if ($("#dengluzhuangtai").html() == "未登录") dengluNext();
}
//编辑状态下点击地图
function onMapClick(e) {
	let noEdit = $("#noEdit").val();
	if (noEdit != "" && noEdit == 0) {
		id++
		marker = L.marker(e.latlng, { "id": id, "second": 2 }).addTo(map).bindPopup("<span> " + e.latlng +" </span><br>延续时长<input type='text' id='"+id+"'  style='width: 20px;' 	value='2' onchange='updateMarker(this)'>秒<br><button onclick='deleteMarker(" + id + ")'>删除</button></div>").openPopup();
		map.flyTo(e.latlng);
		markers.push(marker);
		reDrawLint();
	} else {

	}

}

//重绘线路
function reDrawLint() {
	// 清除图层组中的所有图层
	polylineGroup.clearLayers()
	let line = [];
	for (var i = 0; i < markers.length; i++) {
	line.push([markers[i].getLatLng().lat, markers[i].getLatLng().lng]);
		
	}
	let l=L.polyline(line, { color: 'green' }).addTo(map);
	polylineGroup.addLayer(l);
}
function updateMarker(input) {
	let id = input.getAttribute("id");
	for (let i = 0; i < markers.length; i++) {
		let marker = markers[i];
		if (marker.options.id == id) {
			marker.options.second = parseInt(input.value);
			marker._popup._content = "<span> " + marker.getLatLng() + " </span><br>延续时长<input type='text' id='" + id + "'  style='width: 20px;' 	value='" + input.value + "' onchange='updateMarker(this)'>秒<br><button onclick='deleteMarker(" + id + ")'>删除</button></div>";
		}
	}


}

//删除标记
function deleteMarker(id) {
	// 遍历markers数组，找到匹配的id
	for (var i = 0; i < markers.length; i++) {
		var marker = markers[i]; if (marker.options.id == id) {
			// 从markers数组和地图中移除该marker
	markers.splice(i, 1); map.removeLayer(marker); break;
		}
	}
	reDrawLint();
}
//清空marks，删除所有marker
function deleteAllMarker() {
	for (var i = 0; i < markers.length; i++) {
		var marker = markers[i];
		map.removeLayer(marker);
}
	markers.length = 0;
}
//改变环境
function changeHuanjing() {
	let mapUrlindex = $("#selectMap").val();
	let mapUrl = getUrl(mapUrlindex);
/*	let noEdit = $("#noEdit").val();
	let bottomText = $("#bottomText").val();*/
	map.removeLayer(Baselayer);
	Baselayer = L.tileLayer(mapUrl).addTo(map);
/*	document.cookie = "mapUrlindex=" + escape(mapUrlindex);
	document.cookie = "mapUrl=" + escape(mapUrl);
	document.cookie = "noEdit=" + escape(noEdit);
	document.cookie = "bottomText=" + escape(bottomText);
	location.reload();*/
	//L.control.layers(mapUrl, null).addTo(map);
	layer.closeAll();
	marker.remove();
}
//放置标记
function addPiont() {
	$("#xy").val("");
	ToggleDropdown();
	openCustomLt("按经纬度放置标记", "400", "220", $("#addPiont"), 'setPiont()');
}
//放置标记
function setPiont() {
	let xy = $("#xy").val();
	let x = xy.substring(0, xy.indexOf(","));
	let y = xy.substring(xy.indexOf(",") + 1, xy.length)
	id++;
	let isEx = false;
	if (markers.length > 0) {
		let m = markers[markers.length-1]
		if (m.getLatLng().lat == x && m.getLatLng().lng == y) {
			isEx = true;
		}
	}
		

	
	if (!isEx) {
		marker = L.marker([x, y], { "id": id, "second": 2 }).addTo(map).bindPopup("<span> " + [x, y] +" </span><br>延续时长<input type='text' id='" + id + "'  style='width: 20px;' 	value='2' onchange='updateMarker(this)'>秒<br><button onclick='deleteMarker(" + id + ")'>删除</button></div>").openPopup();
		map.flyTo([x, y]);
		markers.push(marker);
		reDrawLint();
	} else layer.alert("坐标已存在不能添加", { title: "错误", icon: 2 });

}
//删除路径
function deletePath() {
	var opt = $("#pathList").val();
	if (opt != "") {
		//删除所有标记
		deleteAllMarker();
		// 清除图层组中的所有图层
		polylineGroup.clearLayers()
		action = currentEvent.action;
		action.splice(opt, 1);
		currentEvent.action = action;
	
		$("#pathList option[value='"+opt+"']").remove();
		//地图级别
		$("#mapLevelForedit").val("");
		//时间
		$("#yearmonth").val("");
		//图标
		$("#imgId").val("");
		//说明
		$("#chname").val("");
	}

}
//新增事件
function newEvent() {
	$("#evenName").val("");
	//时间
	$("#stime").val("");
	//图标
	$("#etime").val("");
	 openCustom("新增事件", "400", "250", $("#addEven"), 'saveEvent()');
}
//保存新增事件
function saveEvent() {
	let newid = guid();
	let evenName = $("#evenName").val();
	$("#nowAction").append("<option value='" + newid + "'>" + evenName + "</option>");
	$("#nowAction").val(newid);
	currentEvent = {
		"chname": evenName,
		"sTime": $("#stime").val(),
		"eTime": $("#etime").val(),
		"personId": $("#personId").val(),
		"id": newid,
		"action":[]
	}
	layer.closeAll();
}
//新增路径
function addPath() {
	if (markers.length == 0) { layer.alert("没有路径无需保存", { title: "错误", icon: 2 }); return false; }
	layer.closeAll();
	$("#pathListDiv").hide();
		//地图级别
		$("#mapLevelForedit").val("");
	//时间
	$("#yearmonth").val("");
	//图标
	$("#imgId").val("");
	//说明
	$("#chname").val("");
	ToggleDropdown();
	openCustom("保存路径", "800", "700", $("#savePath"), 'savePath(0)');
}
//选择图标
function setIco(icoid){
	$("#imgId").val(icoid);
	layer.close(c_index);
}
//选择图标
function selectIco() {
	c_index=openCustomIco("点击图标进行选择", "400", "200", $("#layerImg"));
}
//修改事件路径
function selectTime() {
	var opt = $("#pathList").val();
	if (opt != "") {
		//删除所有标记
		deleteAllMarker();
		// 清除图层组中的所有图层
		polylineGroup.clearLayers()
		piont = currentEvent.action[opt].piont;
		for (let i = 0; i < piont.length; i++) {
			marker = L.marker(piont[i].zb, { "id": i, "second": piont[i].second }).addTo(map).bindPopup("<span> " + piont[i].zb +" </span><br>延续时长<input type='text' id='" + i + "'  style='width: 20px;' 	value='2' onchange='updateMarker(this)'>秒<br><button onclick='deleteMarker(" + i + ")'>删除</button></div>").openPopup();
			
			markers.push(marker);
		}
		map.flyTo(piont[piont.length - 1].zb);
		map.setView(piont[piont.length - 1]["zb"], currentEvent.action[opt].level);

		//地图级别
		$("#mapLevelForedit").val(currentEvent.action[opt].level);
		//时间
		$("#yearmonth").val(currentEvent.action[opt].time);
		//图标
		$("#imgId").val(currentEvent.action[opt].icon);
		//说明
		$("#chname").val(currentEvent.action[opt].chname);
		reDrawLint();
	} else {
		//地图级别
		$("#mapLevelForedit").val("");
		//时间
		$("#yearmonth").val("");
		//图标
		$("#imgId").val("");
		//说明
		$("#chname").val("");
	}
}
//编辑路径
function editPath() {
	$("#pathListDiv").show();
	let action = currentEvent.action
	action.sort(function (a, b) { return a.time - b.time });
	$("#pathList").empty().append("<option></option>");
	for (let i = 0; i < action.length; i++) {
		$("#pathList").append("<option  value='" + i +"'>" + action[i].time+"</option>");
	}
	//地图级别
	$("#mapLevelForedit").val("");
	//时间
	$("#yearmonth").val("");
	//图标
	$("#imgId").val("");
	//说明
	$("#chname").val("");
	ToggleDropdown();
	openCustomLb("修改路径", "450", "400", $("#savePath"), 'savePath(1)');
}
//保存路径
function savePath(isX) {
	let piont = [];
	for (var i = 0; i < markers.length; i++) {
		var marker = markers[i];
		piont.push({ "zb": [marker.getLatLng().lat, marker.getLatLng().lng], "second": marker.options.second })
	}
	let a = {
		"chname": $("#chname").val(),
		"time": parseInt($("#yearmonth").val()),
		"level": parseInt($("#mapLevelForedit").val()),
		"icon": $("#imgId").val(),
		"piont": piont
	}
	let action = currentEvent.action
	if ($("#chname").val() == "" || $("#yearmonth").val() == "" || $("#mapLevelForedit").val() == "") { layer.alert("时间、级别、说明必须填写", { title: "错误", icon: 2 }); return false; }
	let isEx = -1;
	for (let i = 0; i < action.length; i++) {
		if (action[i].time == a.time) isEx = i; break;
	}
	if (isX == 0)//新增
	{
		if (isEx>=0) { layer.alert("存在时间相同的数据不能添加", { title: "错误", icon: 2 }); return false; }
		currentEvent.action.push(a);
	}
	else if (isX == 1)//修改
	{
		action.splice(isEx, 1, a);
		currentEvent.action = action;
	}
	
	
		//删除所有标记
	deleteAllMarker();
		// 清除图层组中的所有图层
		polylineGroup.clearLayers()

		layer.closeAll();
	layer.alert("成功", { title: "消息", icon: 0 })

}
//改变环境变量
function gaibianHuanjing() {
	//地图选择
	if ($("#selectMap").val()=="")
		$("#selectMap").val(-1)
	//显示级别
	$("#mapLevel").val(map.getZoom());
	//是否禁止编辑
	//let noEdit = getCookie("noEdit");
	//$("#noEdit").val(noEdit);

	//是否禁止编辑
	//let bottomText = getCookie("bottomText");
	//$("#bottomText").val(bottomText);
	ToggleDropdown();
	openCustom("改变环境", "800", "700", $("#changeHuanjing"), 'changeHuanjing()');
}
//获取地图url
function getUrl(mapUrlindex) {
	let mapUrl = "";
	if (mapUrlindex == -1) {
		mapUrl = "http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}";
	} else if (mapUrlindex == 0) {
		mapUrl = "http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}";
	}
	else if (mapUrlindex == 1) {
		mapUrl = "https://a.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38";
	}
	else if (mapUrlindex == 2) {
		mapUrl = "https://tile-c.openstreetmap.fr/hot/{z}/{x}/{y}.png";
	}
	else if (mapUrlindex == 3) {
		mapUrl = "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
	}
	else if (mapUrlindex == 4) {
		mapUrl = "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}";
	}
	else if (mapUrlindex == 5) {
		mapUrl = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}";
	}
	else if (mapUrlindex == 6) {
		mapUrl = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=m&x={x}&y={y}&z={z}";
	}
	else if (mapUrlindex == 7) {
		mapUrl = "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}";
	}
	return mapUrl
}
//下拉菜单
function ToggleDropdown() {
	     goEdit($("#noEdit").val() == 1);
		var dropdown = document.getElementById("operlist_div_menu");
		if (dropdown.style.display === "none") {
			dropdown.style.display = "block";
		} else {
			dropdown.style.display = "none";
		}

}

//根据地址获取坐标
function getLocation( ) {
	let addr = $("#findxy").val();
	if (addr != "") {
		$.ajax({
			url: "https://restapi.amap.com/v3/geocode/geo",
			dataType: "jsonp",
			type: "get",
			data: { address: addr, output: "json", key: "fc481e6d58260df816b5fa51c22aaf12" },
			success: function (data) {
				if (data.geocodes.length == 1)
					$("#xy").val(data.geocodes[0].location.split(',')[1] + "," + data.geocodes[0].location.split(',')[0]);
				else if (data.geocodes.length > 1) {

				}
			},
			error: function (data) {
				alert("检查网络和地址是否正确！");
			}
		});
	}

}


//更换经纬度
function changeXY() {
	if ($("#xy").val() == "") return false;
	let xy = $("#xy").val();
	if (xy.indexOf(",") == 0) { layer.alert("格式不对", { title: "错误", icon: 2 }); return false; }
	let yx = xy.substring(xy.indexOf(",") + 1, xy.length) + "," + xy.substring(0, xy.indexOf(","));
	$("#xy").val(yx);
}
//预制事件 李白生平
var yz = {
    "chname": "李白生平",
    "sTime": 701,
    "eTime": 763,
    "personId": "f5e9d43cb9a847ac816c960e6000bc8b",
    "id": "0",
    "action": [
        {
            "chname": "公元701年李白出生在西域碎叶城，今天的吉尔吉斯斯坦托克马克，家里是商人出身",
            "time": 701,
            "level": 5,
            "icon": "4c14023776f047d4a254552d95835c51",
            "piont": [
                {
                    "zb": [
                        42.805222,
                        75.199889
                    ],
                    "second": 3
                }
            ]
        },
        {
            "chname": "705年碎叶城发生战乱，李白的父亲带着全家逃回了四川",
            "time": 705,
            "level": 5,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        42.805222,
                        75.199889
                    ],
                    "second": 1
                },
                {
                    "zb": [
                        31.685969,
                        104.690644
                    ],
                    "second": 4
                }
            ]
        },
        {
            "chname": "神龙元年（705年）李白五岁。发奋读书始于是年,(718年)李白十八岁。隐居戴天大匡山（在今四川省江油市内）读书。往来于旁郡，先后出游江油、剑阁、梓州（州治在今四川省境内）等地，增长了不少阅历与见识",
            "time": 718,
            "level": 8,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        31.685969,
                        104.690644
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        31.780937,
                        104.743213
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        32.207471,
                        105.574192
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        31.101339,
                        105.08712
                    ],
                    "second": 2
                }
            ]
        },
        {
            "chname": "开元十二年（724年），李白二十四岁。离开故乡而踏上远游的征途。再游成都、峨眉山，然后舟行东下至渝州（今重庆市）。",
            "time": 724,
            "level": 5,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        30.699745,
                        104.077369
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        29.577077,
                        103.35357
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        29.584791,
                        106.529379
                    ],
                    "second": 2
                }
            ]
        },
        {
            "chname": "李白出蜀，“仗剑去国，辞亲远游”。开元十四年（726年），李白二十六岁。春往扬州（今江苏省扬州市）。秋，病卧扬州。冬，离扬州北游汝州（今河南省汝州市），至安陆（今湖北省安陆市）。途经陈州时与李邕相识。结识孟浩然。",
            "time": 726,
            "level": 5,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        32.399944,
                        119.426897
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        34.173007,
                        112.858595
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        33.761029,
                        114.910468
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        31.260673,
                        113.700181
                    ],
                    "second": 2
                }
            ]
        },
        {
            "chname": "开元十五年（727年），是年诏令“民间有文武之高才者，可到朝廷自荐”。秋，全国六十三州水灾，十七州霜旱。李白二十七岁。居于安陆寿山，与故宰相许圉师之孙女结婚，遂家于安陆",
            "time": 727,
            "level": 5,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        31.260673,
                        113.700181
                    ],
                    "second": 3
                }
            ]
        },
        {
            "chname": "开元十六年（728年），吐蕃屡次入侵。李白二十八岁。早春，出游江夏（今湖北省武汉市），与孟浩然相会于斯。",
            "time": 728,
            "level": 5,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        30.383308,
                        114.317632
                    ],
                    "second": 2
                }
            ]
        },
        {
            "chname": "开元十七年（729年），八月五日，唐玄宗为自己40岁生日举行盛大的庆贺活动，并以每年八月五日为千秋节。诏令天下诸州宴乐，休假三日。以宇文融管理全国财赋，强制税法，广为聚敛，供朝廷奢侈之用。李白29岁。在安陆",
            "time": 729,
            "level": 5,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        31.260673,
                        113.700181
                    ],
                    "second": 3
                }
            ]
        },
        {
            "chname": "开元十八年（730年），李白三十岁。春在安陆。前此曾多次谒见本州裴长史，因遭人谗谤，于近日上书自白，终为所拒。初夏，往长安，谒宰相张说，并结识其子张垍。寓居终南山玉真公主（玄宗御妹）别馆。又曾谒见其他王公大臣，均无结果。暮秋游邠州（在长安之西）。冬游坊州（在长安之北",
            "time": 730,
            "level": 6,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        31.260673,
                        113.700181
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        34.16329,
                        108.91358
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        34.956293,
                        108.031626
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        35.698679,
                        109.191033
                    ],
                    "second": 2
                }
            ]
        },
        {
            "chname": "开元十九年（731年），玄宗多任宦官，尤宠高力士，时四方表奏，皆先为高力士所决。十月，玄宗驾幸洛阳。李白三十一岁，穷愁潦倒于长安，自暴自弃，与长安市井之徒交往。初夏，离长安，经开封（今河南省开封市），到宋城（今河南省商丘市）。秋到嵩山五岳之一的中岳（为河南省登封县的名山），恋故友元丹丘的山居所在，遂有隐居之意。暮秋，滞留洛阳。",
            "time": 731,
            "level": 6,
            "icon": "db02cb5cc5494c6cb4770e66b024fb2a",
            "piont": [
                {
                    "zb": [
                        34.16329,
                        108.91358
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        34.829855,
                        114.313868
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        34.432351,
                        115.65785
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        34.520394,
                        113.0225
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        34.629254,
                        112.459999
                    ],
                    "second": 2
                }
            ]
        },
        {
            "chname": "开元二十年（732年），十月，玄宗出巡，诏令巡幸所至，地方官员可将本地区贤才直接向朝廷推荐。十二月，归还洛阳。是年全国户数为786万余，人口4543万余，是有史以来的最高记录。李白自春历夏在洛阳与元演、崔成甫结识。秋，自洛阳返安陆。途经南阳（今河南省南阳市），结识崔宗之。冬，元演自洛阳到安陆相访，二人同游随州（今湖北省随县）。岁未，归家安陆。",
            "time": 732,
            "level": 6,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        34.629254,
                        112.459999
                    ],
                    "second": 5
                },
                {
                    "zb": [
                        32.990833,
                        112.528321
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        31.25565,
                        113.688955
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        31.853833,
                        113.299528
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        31.25565,
                        113.688955
                    ],
                    "second": 2
                }
            ]
        },
        {
            "chname": "开元二十一年（733年），正月，唐玄宗亲注老子《道德经》。令天下士庶（士大夫阶层与庶民 ）家藏一册，每年贡举时加试《老子》策。李白三十三岁，构石室于安陆白兆山桃花岩。开山田，日以耕种、读书为生活。",
            "time": 733,
            "level": 5,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        31.25565,
                        113.688955
                    ],
                    "second": 5
                }
            ]
        },
        {
            "chname": "开元二十二年（734年）正月，李白为唐玄宗献上著作《明堂赋》，赋云：“穹崇明堂，倚天开兮。”又云：“四门启兮万国来，考休征兮进贤才。俨若皇居而作固，穷千祀兮悠哉！”按赋中有“臣白美颂”等字样，疑太白曾以此赋在东都洛阳进献玄宗。此赋盛赞明堂之宏大壮丽，写尽开元盛世的雄伟气象以及作者的政治理想。\n李白《明堂赋》的写作目的是为了谋求官位，其写作时间为开元二十七年拆毁明堂之前，他赋明堂一是为了谋仕的需要，二是“以大道匡君”的需要。由于家庭的缘故，李白不能应常举和制举以入仕途，只能走献赋之路，这是真献赋谋仕的原因。",
            "time": 734,
            "level": 5,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        34.619682,
                        112.45404
                    ],
                    "second": 10
                }
            ]
        },
        {
            "chname": "开元二十三年（735年），玄宗又一次狩猎，正好李白也在西游，乘机献上《大猎赋》，希望能博得玄宗的赏识。他的《大猎赋》希图以“大道匡君，示物周博”，而“圣朝园池遐荒，殚穷六合”，幅员辽阔，境况与前代大不相同，夸耀本朝远胜汉朝，并在结尾处宣讲道教的玄理，以契合玄宗当时崇尚道教的心情。\n是年，李白进长安后结识了卫尉张卿，并通过他向玉真公主献了诗，最后两句说“几时入少室，王母应相逢”，是祝她入道成仙。由此，他一步步地接近了统治阶级的上层。李白这次在长安还结识了贺知章。李白去紫极宫，在那里遇见了贺知章，立刻上前拜见，并呈上袖中的诗本。贺知章颇为欣赏《蜀道难》和《乌栖曲》。李白瑰丽的诗歌和潇洒出尘的风采令贺知章惊异万分，竟说：“公非人世之人，可不是太白星精耶？”贺知章称他为“谪仙人”。三年后，李白发出“行路难，归去来”的感叹，离开长安。",
            "time": 735,
            "level": 5,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        34.156287,
                        108.946657
                    ],
                    "second": 10
                }
            ]
        },
        {
            "chname": "天宝元年（742年），由于玉真公主和贺知章的交口称赞，玄宗看了李白的诗赋，对其十分钦慕，便召李白进宫。李白进宫朝见那天，玄宗降辇步迎，“以七宝床赐食于前，亲手调羹”。玄宗问到一些当世事务，李白凭半生饱学及长期对社会的观察，胸有成竹，对答如流。玄宗大为赞赏，随即令李白供奉翰林，职务是给皇上写诗文娱乐，陪侍皇帝左右。\n玄宗每有宴请或郊游，必命李白侍从，利用他敏捷的诗才，赋诗纪实。虽非记功，也将其文字流传后世，以盛况向后人夸示。李白受到玄宗如此的宠信，同僚不胜艳羡，但也有人因此而产生了嫉恨之心。",
            "time": 742,
            "level": 5,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        34.156287,
                        108.946657
                    ],
                    "second": 5
                }
            ]
        },
        {
            "chname": "天宝二年（743年），李白四十三岁。诏翰林院。初春，玄宗于宫中行乐，李白奉诏作《宫中行乐词》，赐宫锦袍。暮春，兴庆池牡丹盛开，玄宗与杨玉环同赏，李白又奉诏作《清平调》。对御用文人生活日渐厌倦，始纵酒以自昏秽。与贺知章等人结“酒中人仙”之游，玄宗呼之不朝。尝奉诏醉中起草诏书，引足令高力士脱靴，宫中人恨之，谗谤于玄宗，玄宗疏之，后玄宗赐金放还。",
            "time": 743,
            "level": 5,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        31.25565,
                        113.688955
                    ],
                    "second": 5
                }
            ]
        },
        {
            "chname": "天宝三载（744年）夏天，李白到了东都洛阳。在这里，他遇到了杜甫。中国文学史上最伟大的两位诗人见面了。此时，李白已名扬全国，而杜甫风华正茂，却困守洛城。李白比杜甫年长十一岁，但他并没有以自己的才名在杜甫面前倨傲。而“性豪也嗜酒”“结交皆老苍”的杜甫，也没有在李白面前一味低头称颂。两人以平等的身份，建立了深厚的友情。在洛阳时，他们约好下次在梁宋（今开封、商丘一带）会面，访道求仙。",
            "time": 744,
            "level": 5,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        34.619682,
                        112.45404
                    ],
                    "second": 5
                },
                {
                    "zb": [
                        34.797239,
                        114.307581
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        34.414172,
                        115.65637
                    ],
                    "second": 2
                }
            ]
        },
        {
            "chname": "这年的秋冬之际，李杜又一次分手。李白到齐州（今山东济南一带）紫极宫请道士高天师如贵授道箓 [7-8]，从此他算是正式履行了道教仪式，成为道士。其后李白又赴德州安陵县，遇见这一带善写符箓的盖还，为他造了真箓。此次的求仙访道，李白得到了完满的结果。\n天宝四载（745年）秋天，李白与杜甫在东鲁第三次会见。短短一年多的时间，他们两次相约，三次会见，知交之情不断加深。他们一道寻访隐士高人，也偕同去济州拜访过当时驰名天下的文章家、书法家李邕。就在这年冬天，李杜两人分手。",
            "time": 745,
            "level": 5,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        36.651216,
                        117.119999
                    ],
                    "second": 3
                },
                {
                    "zb": [
                        37.434092,
                        116.357464
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        36.192084,
                        117.135354
                    ],
                    "second": 2
                }
            ]
        },
        {
            "chname": "天宝十四载（755年），安史之乱爆发后，李白与妻子宗氏一道南奔避难。春在当涂。旋闻洛阳失陷，中原横溃，乃自当涂返宣城，避难剡中（今浙江省嵊州）。至溧阳（今江苏省溧阳市），与张旭相遇。夏至越中。闻郭子仪、李光弼在河北大胜，又返金陵。秋，闻玄宗奔蜀，遂沿长江西上，入庐山屏风叠隐居。",
            "time": 755,
            "level": 6,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        31.570857,
                        118.497873
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        30.940718,
                        118.758816
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        29.56141,
                        120.831025
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        31.416911,
                        119.484211
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        30.077559,
                        120.637543
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        29.023355,
                        114.54479
                    ],
                    "second": 2
                }
            ]
        },
        {
            "chname": "至德二载（757年），李白五十七岁。正月，在永王军营，作组诗《永王东巡歌》抒发了建功报国情怀。永王擅自引兵东巡，导致征剿，兵败。李白在浔阳入狱。被宋若思、崔涣营救。成为宋若思的幕僚后，为宋写过一些文表，并跟随他到了武昌。李白在宋若思幕下很受重视，并以名义再次向朝廷推荐，希望再度能得到朝廷的任用。终以参加永王东巡而被判罪长流夜郎（今贵州桐梓）。",
            "time": 757,
            "level": 6,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        30.040973,
                        112.435138
                    ],
                    "second": 5
                },
                {
                    "zb": [
                        29.70547,
                        116.001677
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        30.548456,
                        114.299833
                    ],
                    "second": 2
                }
            ]
        },
        {
            "chname": "乾元元年（758年），四月，史思明反。五月，肃宗罢张镐宰相，出为荆州大都督长史。十二月，史思明陷魏州（今河北省南部）。李白五十八岁。李白自浔阳出发，开始长流夜郎，妻弟宗嫌相送。春末夏初。途经西塞驿（今武昌县东），至江夏，访李邕故居，登黄鹤楼，眺望鹦鹉洲。秋至江陵，冬入三峡。是年杜甫四十七岁，为华州司功参军。",
            "time": 758,
            "level": 6,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        30.548456,
                        114.299833
                    ],
                    "second": 10
                },
                {
                    "zb": [
                        30.357992,
                        114.324575
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        30.040973,
                        112.435138
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        31.03424,
                        109.539507
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        28.133583,
                        106.825644
                    ],
                    "second": 2
                }
            ]
        },
        {
            "chname": "乾元二年（759年），朝廷因关中遭遇大旱，宣布大赦，规定死者从流，流以下完全赦免。李白经过长期的辗转流离，终于获得了自由。他随即顺着长江疾驶而下，而那首著名的《早发白帝城》最能反映他当时的心情。到了江夏，由于老友良宰正在当地做太守，李白便逗留了一阵。乾元二年，李白应友人之邀，再次与被谪贬的贾至泛舟赏月于洞庭之上，发思古之幽情，赋诗抒怀。不久，又回到宣城、金陵旧游之地。差不多有两年的时间，他往来于两地之间，仍然依人为生。",
            "time": 759,
            "level": 6,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        28.133583,
                        106.825644
                    ],
                    "second": 7
                },
                {
                    "zb": [
                        30.357992,
                        114.324575
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        29.260706,
                        113.029533
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        30.940718,
                        118.758816
                    ],
                    "second": 2
                },
                {
                    "zb": [
                        32.060255,
                        118.796877
                    ],
                    "second": 2
                }
            ]
        },
        {
            "chname": "上元二年（761年），已六十出头的李白因病返回金陵。在金陵，他的生活相当窘迫，不得已只好投奔了在当涂做县令的族叔李阳冰。\n上元三年（762年），李白病重，在病榻上把手稿交给了李阳冰，赋《临路歌》后去世。",
            "time": 761,
            "level": 6,
            "icon": "",
            "piont": [
                {
                    "zb": [
                        32.060255,
                        118.796877
                    ],
                    "second": 5
                },
                {
                    "zb": [
                        31.570857,
                        118.497873
                    ],
                    "second": 5
                }
            ]
        }
    ]
};



