/**
 * @author 江超群
 * 专门用来读取我们自己的人体模型
 */

var Human = function(show)
{
	this.material = null;						// 存放人体贴图，人体与眼睛共用一个材质

	this.mixer = null;							// 用来播放动画

	this.human = null;							// body
	this.eyes = null;								// 眼球和人体是分开的
	this.hair = null;								// 人的头发

	this.upcloth = null;						// 上衣
	this.trousers = null;						// 裤子
	this.glasses = null;						// 眼镜
	this.shoes = null;							// 鞋

	this.group = new THREE.Group();			// 因为衣服和人是一起的，如果移动应该一起移动，所以要加在一个group里

	this.skeletonhelper = null;			// 骨架显示
	this.skeleton = null;

	this.heightScale = 0.0;					// 范围 0.0-1.0
	this.heightArray = [];					// 存放身高缩放比例的数组
	this.heightAdjust = [];					// 调节后的身高影响值

	this.fingerScale = 0.0;					// 范围 0.0-1.0
	this.fingerArray = [];					// 存放体型缩放比例的数组
	this.fingerAdjust = [];					// 调节后的体型影响值

	this.skeletonNeedUpdate = false;	// 如果一直监视的话，消耗会很大，所以只有调节的时候需要更新


};

Human.prototype = {
	load:function(url_body, url_eye, url_diffuse, url_specular)	// 从外部调用这个函数
	{
	},

	loadMaterial:function(url_diffuse, url_specular)
	{
	},

	loadHuman:function(hu, url_body, url_eye,  url_diffuse, url_specular, url_normal, url_Opacity, url_light)
	/**
	*	保证模型加载完成后在加载贴图。
	* hu: Human类在new处的名称
	* url_body: body的url
	* url_eye: eyede的url
	* url_diffuse: diffuset贴图的地址
	*	url_specular: specular的贴图地址
	*	url_normal: normal的贴图地址
	*	url_Opacity: opacity的贴图地址
	* url_light: light贴图的地址
	*/
	{
		var skinnedMesh = null;

		var loader = new THREE.JSONLoader();

		var onProgress = function ( xhr ) {		// 用来调试读取进度
			if ( xhr.lengthComputable ) {
					var percentComplete = xhr.loaded / xhr.total * 100;
					console.log( Math.round(percentComplete, 2) + '% downloaded' );
				}
		};

		var onError = function ( xhr ) {		// 读取错误时执行
			console.log("图片加载错误");
		};

		var loadEyes = function(url_eye){																	// 函数放在这是为了使眼睛和身体同时导入
			var loader = new THREE.JSONLoader();
			var eyes = null;
			loader.load( url_eye, function ( geometry, materials ) {				// 加载模型,与身体共用同一材质

				eyes = new THREE.SkinnedMesh(geometry, hu.material);		// 用眼睛的geometry和共用的材质新建眼球
				eyes.bind(hu.human.skeleton, eyes.matrixWorld);		// 将眼镜的mesh绑定身体的骨架
				//show.addObject(eyes);
				hu.group.add(eyes);
				hu.eyes = eyes;
				console.log("添加了眼球");

			},onProgress,onError);						// load eyes
		};

		var addSkeletonHelper = function(model)
		{
			hu.skeletonhelper = new THREE.SkeletonHelper(model);
			hu.skeletonhelper.linewidth = 10;
			hu.skeletonhelper.visible = false;
			show.addHelper(hu.skeletonhelper);
		};

		loader.load( url_body, function ( geometry, materials ) {				// 加载模型,模型加载完成后加载贴图

			var diffuse = new THREE.Texture();	// 读取diffuse贴图
			var specular = new THREE.Texture();		// 读取specular贴图
			var normal = new THREE.Texture();			// 读取normal贴图
			var opacity = new THREE.Texture();		// 读取opacity贴图
			var light = new THREE.Texture();			// 读取光照贴图

			var loader = new THREE.ImageLoader();			// 新建用来读diffuse
			var loader2 = new THREE.ImageLoader();		// 读取specular
			var loader3 = new THREE.ImageLoader();		// 读取normal
			var loader4 = new THREE.ImageLoader();		// 读取opacity
			var loader5 = new THREE.ImageLoader();		// 读取light贴图

			if(url_diffuse !== null)													// 如果后面两个贴图地址不存在就直接跳过
			{
				loader.load( url_diffuse, function ( image ) {		// 读取diffuse贴图

					diffuse.image = image;
					diffuse.needsUpdate = true;
					console.log("diffuse加载完成");

					loader2.load( url_specular, function ( image ) {		// 读取normal贴图

							specular.image = image;
							specular.needsUpdate = true;
							console.log("specular加载完成");

							loader3.load( url_normal, function ( image ) {		// 读取normal贴图

									normal.image = image;
									normal.needsUpdate = true;
									console.log("normal加载完成");

									loader4.load( url_Opacity, function ( image ) {		// 读取normal贴图

											opacity.image = image;
											opacity.needsUpdate = true;
											console.log("opacity加载完成");

											loader5.load( url_light, function ( image ) {		// 读取normal贴图

													light.image = image;
													light.needsUpdate = true;
													console.log("light加载完成");

													hu.material = new THREE.MeshPhongMaterial({				// 此处两张图片都加载完成
														specular:0xffffff,
														map:diffuse,
														specularMap:specular,
														normalMap:normal,
														alphaMap:opacity,
														skinning:true,
														lightMap:light,
														//shininess:30

													});

													skinnedMesh = new THREE.SkinnedMesh(geometry,hu.material);
													skinnedMesh.scale.set( 1, 1, 1 );
													hu.group.add(skinnedMesh);											// 添加到group()
													//show.addObject( skinnedMesh );					// 添加到场景中
													hu.human = skinnedMesh;

													loadEyes(url_eye);										// 添加眼镜
													addSkeletonHelper(skinnedMesh);				// 添加骨架显示

													hu.skeleton = skinnedMesh.skeleton;	// 留下骨架接口

										} ,onProgress,onError);		// load light
									} ,onProgress,onError);		// load opacity
								} ,onProgress,onError);		// load normal
							} ,onProgress,onError);		// load specular
						} ,onProgress,onError);			// load diffuse
			}
			else
			{
				skinnedMesh = new THREE.SkinnedMesh(geometry,materials);
				skinnedMesh.scale.set( 1, 1, 1 );
				//show.addObject( skinnedMesh );					// 添加到场景中
				hu.group.add(skinnedMesh);											// 添加到group
				loadEyes(url_eye);
				addSkeletonHelper(skinnedMesh);
			}


		},onProgress,onError);					// load human
	},

	loadCloth:function(hu, type, url_cloth, url_diffuse, url_specular, url_normal, url_Opacity, url_light)
	/**
	* 参数说明:
	* hu: 此类在全局中的名称
	* type: 字符串，为衣服类型 "upcloth", "trousers" , "glasses", "shoes", "hair"
	* url_cloth: 衣服路径
	* url_diffuse: diffuse贴图路径
	* url_specular: specular贴图的路径
	* url_normal: normal贴图路径
	* url_Opacity: alpha贴图路径
	* url_light: light贴图路径
	*/
	{
		var material = new THREE.MeshPhongMaterial({		// 测试不同步加载的显示效果
			specular:0xffffff,
			skinning:true
		});

		var diffuse = new THREE.Texture();	// 读取diffuse贴图
		var specular = new THREE.Texture();		// 读取specular贴图
		var normal = new THREE.Texture();			// 读取normal贴图
		var opacity = new THREE.Texture();		// 读取opacity贴图
		var light = new THREE.Texture();			// 读取光照贴图

		var loader1 = new THREE.ImageLoader();			// 新建用来读diffuse
		var loader2 = new THREE.ImageLoader();		// 读取specular
		var loader3 = new THREE.ImageLoader();		// 读取normal
		var loader4 = new THREE.ImageLoader();		// 读取opacity
		var loader5 = new THREE.ImageLoader();		// 读取light贴图

		var onProgress = function ( xhr ) {		// 用来调试读取进度
			if ( xhr.lengthComputable ) {
					var percentComplete = xhr.loaded / xhr.total * 100;
					console.log( Math.round(percentComplete, 2) + '% downloaded' );
				}
		};

		var onError = function ( xhr ) {		// 读取错误时执行
			console.log("图片加载错误");
		};

		loader1.load( url_diffuse, function ( image ) {		// 读取diffuse贴图

				diffuse.image = image;
				diffuse.needsUpdate = true;
				material.map = diffuse;												// 将贴图加载在材质上

				console.log("diffuse贴图加载完成");

		} ,onProgress,onError);			// load diffuse

		loader2.load( url_specular, function ( image ) {		// 读取specular贴图

				specular.image = image;
				specular.needsUpdate = true;
				material.specularMap = specular;

				console.log("specular贴图加载完成");

		} ,onProgress,onError);			// load specular

		loader3.load( url_normal, function ( image ) {		// 读取normal贴图

				normal.image = image;
				normal.needsUpdate = true;
				material.normalMap = normal;

				console.log("normal贴图加载完成");

		} ,onProgress,onError);			// load normal

		loader4.load( url_Opacity, function ( image ) {		// 读取opacity贴图

				opacity.image = image;
				opacity.needsUpdate = true;
				material.alphaMap = opacity;

				console.log("opacity贴图加载完成");

		} ,onProgress,onError);			// load opacity

		loader5.load( url_light, function ( image ) {		// 读取light贴图

				light.image = image;
				light.needsUpdate = true;
				material.lightMap = light;

				console.log("light贴图加载完成");

		} ,onProgress,onError);			// load light

		var jsonloader = new THREE.JSONLoader();
		var cloth = null;
		jsonloader.load( url_cloth, function ( geometry, materials ) {				// 加载衣服模型，使用上面加载的衣服

			cloth = new THREE.SkinnedMesh(geometry, material);		//	新建衣服模型
			cloth.bind(hu.human.skeleton, cloth.matrixWorld);			// 将人体模型的骨架绑定在衣服上
			hu.group.add(cloth);

			console.log("添加了衣服模型");

		},onProgress,onError);						// load eyes


		switch(type)     // 分成四类模型问题讨论
		{
			case 'upcloth':
			hu.upcloth = cloth;
			break;
			case 'trousers':
			hu.trousers = cloth;
			break;
			case 'glasses':
			hu.glasses = cloth;
			break;
			case 'shoes':
			hu.shoes = cloth;
			break;
			case 'shoes':
			hu.hair = cloth;
			break;
		};
	},

	addMixer:function()
	{
		if(this.human ===null)	return;															// 在人体构建之前不能使用此函数
		this.mixer = new THREE.AnimationMixer( this.human );
		this.mixer.clipAction(this.human.geometry.animations[0]).play();
	},

	update:function(clock)																										// 将需要update的函数放在这里
	{
			if(this.mixer !== null)
			{
				this.update(clock.getDelta());					// 动画需要播放
			}
			if(this.skeletonhelper !== null)
			{
				this.skeletonhelper.update();							// 骨架需要更新
			}
	},

	playSpeed:function(scale)					// 默认为1.0 ，为-1.0时可以倒着播放动画
	{
		this.mixer.timeScale = scale;
	},

	remove:function()									// 从场景中移除所有模型
	{
		if(this.human !== null)
			show.scene.remove(this.human);
		if(this.eyes !== null)
			show.scene.remove(this.eyes);
	},

init:function(hu)															// hu: 此类在new处的名称
{
	var initHeightArray = function(hu)
	{
			hu.heightArray = [											// 初始化数组
			[0.010775,0.010775,0.010775],
			[1.04563,1,1],
			[1,0.999999,1],
			[1,1,1],
			[0.929456,0.929457,0.929456],
			[1.00172,1.03365,1.03365],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[0.999999,1,1],
			[1,1,1],
			[1,1,0.999999],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[0.999999,1,1],
			[1,1,1],
			[1,0.999999,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,0.999999,1],
			[1,1,1],
			[0.999999,1,1],
			[1,1,1],
			[1,0.999999,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,0.999999],
			[1,1,1],
			[1,0.999999,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,0.999999,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1.12631,1.00003,1.13808],
			[1,1,1.04672],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1.12632,1.00008,1.13808],
			[1,1,1.04672],
			[1,1,1],
			[0.999999,1,1],
			[1,1,1]
		];
		console.log("heightArray的长度",hu.heightArray.length );

		hu.heightArray[0][0] = hu.heightArray[0][0] - 0.01;
		hu.heightArray[0][1] = hu.heightArray[0][1] - 0.01;
		hu.heightArray[0][2] = hu.heightArray[0][2] - 0.01;


		for(var i = 1; i <hu.heightArray.length; i++)				// 减一
		{
			hu.heightArray[i][0] = hu.heightArray[i][0] - 1;
			hu.heightArray[i][1] = hu.heightArray[i][1] - 1;
			hu.heightArray[i][2] = hu.heightArray[i][2] - 1;
		}

		hu.heightAdjust = new Array(67);										// 初始化heightAdjust权重的数组
		hu.heightAdjust[0] = [0.01,0.01,0.01];

		for(var i = 1 ; i < hu.heightAdjust.length; i++)
		{
			hu.heightAdjust[i] = new Array(3);
			hu.heightAdjust[i][0] = 1;
			hu.heightAdjust[i][1] = 1;
			hu.heightAdjust[i][2] = 1;
		}
		console.log('权重数组初始化完成');
	};


	var initFingerArray = function(hu)
	{
		hu.fingerArray = [
			[0.013069,0.014969,0.01],
			[0.883266,0.883266,1],
			[1.02974,1.02974,0.999999],
			[0.868215,0.868215,1],
			[0.961995,0.858893,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1.07371,1.31937,1],
			[0.724358,0.774627,1],
			[1,1,1],
			[1,1,0.999999],
			[1,1,1],
			[1,0.999999,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,0.999999],
			[1,1,1],
			[1,0.999999,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,0.999999,1],
			[1,1,1],
			[0.999999,1,1],
			[1,1,1],
			[1,0.999999,1],
			[1,1,1],
			[1,1,1],
			[1.0737,1.31937,1],
			[0.724359,0.774627,1],
			[1,1,0.999999],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,0.999999,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[0.984572,0.984597,1],
			[0.844192,0.844192,0.999999],
			[0.853929,1,0.732373],
			[1,1,1],
			[1,1,1],
			[0.984572,0.98465,1],
			[0.844192,0.844192,0.999999],
			[0.853929,1,0.732373],
			[1,1,1],
			[1,1,1]
		];
		console.log("fingerArray的长度", hu.fingerArray.length );

		hu.fingerArray[0][0] = hu.fingerArray[0][0]  - 0.01;
		hu.fingerArray[0][1] = hu.fingerArray[0][1]  - 0.01;
		hu.fingerArray[0][2] = hu.fingerArray[0][2]  - 0.01;

		for(var i = 1; i <hu.fingerArray.length; i++)				// 减一
		{
			hu.fingerArray[i][0] = hu.fingerArray[i][0]  - 1;
			hu.fingerArray[i][1] = hu.fingerArray[i][1]  - 1;
			hu.fingerArray[i][2] = hu.fingerArray[i][2]  - 1;
		}

		hu.fingerAdjust = new Array(67);										// 初始化heightAdjust权重的数组
		hu.fingerAdjust[0] = [0.01, 0.01, 0.01];
		for(var i = 1 ; i < hu.fingerAdjust.length; i++)
		{
			hu.fingerAdjust[i] = new Array(3);
			hu.fingerAdjust[i][0] = 1;
			hu.fingerAdjust[i][1] = 1;
			hu.fingerAdjust[i][2] = 1;
		}
	};

	initHeightArray(hu);
	initFingerArray(hu);
	show.addObject(hu.group);
},


	adjustHeight:function(hu, scale)												// hu是Human在new时的名字
	{
		hu.heightScale = scale;																// 这是hu记录体型的一个属性

		hu.heightAdjust[0][0] = 0.01 + scale * hu.heightArray[0][0];
		hu.heightAdjust[0][1] = 0.01 + scale * hu.heightArray[0][1];
		hu.heightAdjust[0][2] = 0.01 + scale * hu.heightArray[0][2];

		for(var i = 1; i < hu.heightArray.length; i++)
		{
				hu.heightAdjust[i][0] = 1 + scale * hu.heightArray[i][0];
				hu.heightAdjust[i][1] = 1 + scale * hu.heightArray[i][1];
				hu.heightAdjust[i][2] = 1 + scale * hu.heightArray[i][2];
		}
	},

	adjustFinger:function(hu, scale)
	{
		hu.fingerScale = scale;																	// 这是hu记录体型的一个属性

		hu.fingerAdjust[0][0] = 0.01 + scale * hu.fingerArray[0][0];
		hu.fingerAdjust[0][1] = 0.01 + scale * hu.fingerArray[0][1];
		hu.fingerAdjust[0][2] = 0.01 + scale * hu.fingerArray[0][2];

		for(var i = 1; i < hu.fingerArray.length; i++)
		{
				hu.fingerAdjust[i][0] = 1 + scale * hu.fingerArray[i][0];
				hu.fingerAdjust[i][1] = 1 + scale * hu.fingerArray[i][1];
				hu.fingerAdjust[i][2] = 1 + scale * hu.fingerArray[i][2];
		}
	},

	adjustHuman:function(hu)															// hu是Human在new时的名字
	{

		hu.human.skeleton.bones[0].scale.set(
			hu.fingerAdjust[0][0] * hu.heightAdjust[0][0] * 100,
			hu.fingerAdjust[0][1] * hu.heightAdjust[0][1] * 100,
			hu.fingerAdjust[0][2] * hu.heightAdjust[0][2] * 100
		);		// 对所有节点的父节点特殊处理

		for(var i = 1; i < hu.human.skeleton.bones.length; i++)
		{
			var tempBone = hu.human.skeleton.bones[i];
			tempBone.scale.set(
				hu.fingerAdjust[i][0] * hu.heightAdjust[i][0],
				hu.fingerAdjust[i][1] * hu.heightAdjust[i][1],
				hu.fingerAdjust[i][2] * hu.heightAdjust[i][2]
			);
			// tempBone.scale.set(
			// 	hu.heightAdjust[i][0],
			// 	hu.heightAdjust[i][1],
			// 	hu.heightAdjust[i][2]
			// );
		}
	}


}
