/**
 * 点选，光线射线投射，需要在Show.js里添加objects[],存放场景中的所有mesh
 * @author XueFeng
 */

var raycasting = function(show) {
	this.raycaster = null;											// 射线
	this.mouse = null;													// 鼠标坐标
	this.intersected = null;										// 与射线相交的物体
	this.renderer = show.renderer;
	show.raycasting = this;

	//this.objects = [];													// 将场景中的objects中的group拆分，存入该数组
	this.meshes = [];
	this.addRayCaster = false;									// 是否开始点选
	this.needUpdate = true;										// 是否需要更新，应对objects数组
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
					.intersectObjects(myRayCaster.meshes);
			//alert("intersections:"+ intersections.length);


			if (intersections.length > 0) {																	// 存在与射线相交的物体
				if (show.raycasting.raycaster.intersected != intersections[0].object) {
					// alert("color");
					 show.raycasting.intersected = intersections[0].object;

					 if(intersections[0].object.parent instanceof THREE.Group)
						 {
						 		show.selected = intersections[0].object.parent;

								show.signals.objectSelected.dispatch(show.selected);				// 发布选中物体信号
						 }
					 else
						 show.selected = intersections[0].object;								// 选中物体

					 show.selectNeedUpdate = true;
				}

			}
			else
			{
				
					//console.log("没有选中目标物");
					//console.log(show.raycasting.meshes);
			}
		}

	},				// onDocumentMouseClick : function(event)

	setRayCaster : function() {																								// 调用该函数，开启点选功能
		addRayCaster = true;
	},

	update : function() {
		if (this.needUpdate) {
			this.meshes = [];
			this.needUpdate = false;
			for (var i = 0; i < show.objects.length; i++) {// 遍历show.objects中的对象，判断是否为group类型
				if (show.objects[i] instanceof THREE.Group) {// 是group类型，遍历其孩子对象
					//alert("group");
					for(var j = 0; j < show.objects[i].children.length; j ++){
						this.meshes.push(show.objects[i].children[j]);
					}
				} else {
					//alert("not group");
					this.meshes.push(show.objects[i]);
				}
			}
			//alert("meshes0:" + this.meshes.length);
		}
	}

//	 update : function(ray)																										// ray为此类在全局中的名字
//	 {
//	 	if(ray.addRayCaster)											// 如果开启射线功能才去执行其他的更新操作
//	 	{
//
//	 		if(ray.needUpdate)																											// 如果需要更新
//	 		{
//	 			ray.needUpdate = false;
//	 			ray.objects = [];																											// 先将待检测数组置为空数组
//	 			for(var i = 0; i < show.objects.length; i++)
//	 			{
//	 				if(show.objects[i] instanceof THREE.Group)													// 如果遇到group,将Group拆分，不是group直接装入
//	 				{
//	 					var temp = show.objects[i];
//	 					for(var j = 0; j < temp.children.length; j++)
//	 					{
//	 						ray.objects.push(temp.children[j]);															// 将group的每个孩子都加入到数组中
//	 					}
//	 				}		// if(show.objects[i] instanceof THREE.Group)
//	 				else
//	 				{
//	 						ray.objects.push(show.objects[i]);															// 不是group 直接装入数组
//	 				}
//	 			}		// 	for(var i = 0; i < show.objects.length; i++)
//	 		}		// if(ray.needUpdate)
//
//	 	}		// if(ray.addRayCaster)
//
//	 }					// update : fucntion(ray)
};
