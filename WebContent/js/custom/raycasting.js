/**
 * 点选，光线射线投射，需要在Show.js里添加objects[],存放场景中的所有mesh
 * @author XueFeng
 */

var raycasting = function(show) {
	this.raycaster = null;//射线
	this.mouse = null;//鼠标坐标
	this.intersected = null;//与射线相交的物体
	this.renderer = show.renderer;
	show.raycasting = this;

	this.addRayCaster = false;//是否开始点选
};

raycasting.prototype = {
	init : function() {
		//alert("init");
		//初始化raycaster
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.renderer.domElement.addEventListener('click',
				this.onDocumentMouseClick, false);

		this.addRayCaster = true;
	},
	onDocumentMouseClick : function(event) {
		//初始化鼠标信息，初始化raycaster
		//alert("click");
		if (myRayCaster.addRayCaster) {
			event.preventDefault();
			show.raycasting.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			show.raycasting.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
			show.raycasting.raycaster.setFromCamera(show.raycasting.mouse,
					show.camera);

			var intersections;//与射线相交的所有物体,intersections[0]就是与射线相交的最前面的物体
			//alert("objects.length:" + show.objects.length);
			intersections = show.raycasting.raycaster
					.intersectObjects(show.objects);
			//alert("intersections:"+ intersections.length);

			if (intersections.length > 0) {																	// 存在与射线相交的物体
				if (show.raycasting.raycaster.intersected != intersections[0].object) {
					// alert("color");
					 show.raycasting.intersected = intersections[0].object;
					// show.raycasting.intersected.material.color
					// 		.setHex('#FFFFFF');//将物体颜色设置成黑色
					/*if ( show.raycasting.raycaster.intersected )
						show.raycasting.raycaster.intersected.material.color.setHex( '#EEEEEE' );*/
						show.selected = intersections[0].object;								// 选中物体
						show.selectNeedUpdate = true;
				}

			}
		}

	},

	setRayCaster : function() {//调用该函数，开启点选功能
		addRayCaster = true;
	}
};
