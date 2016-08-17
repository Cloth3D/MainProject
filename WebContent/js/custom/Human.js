/**
 * @author 江超群
 * 专门用来读取我们自己的人体模型
 */

var Human = function(show)
{
	this.show = show;

	this.material = null;						// 存放人体贴图，人体与眼睛共用一个材质
	this.alpha = null;							// 人体最初的透明贴图
	this.clothAlpha = [];						// 存放先存衣服的透明贴图 上衣 裤子 鞋子 最多三张贴图。
	// this.clothAlpha['upcloth'] , ['trousers'] , ['shoes']  等等

	this.mixer = null;							// 用来播放动画
	this._clock = null;							// 如果新建了播放动画的工具，就初始化一个时钟
	this.clipaction = null;					// 动作播放控制器

	this.human = null;							// body
	this.eyes = null;								// 眼球和人体是分开的
	this.eyelashes = null;					// 睫毛，因为有透明贴图，所以睫毛的效果可以留下

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


};				// var Human = function(show)

Human.prototype = {

	load:function(hu, url_body, url_eye, url_eyelashes,  url_diffuse, url_specular, url_normal, url_Opacity, url_light, onload)
	{
		/**
		*	采用不同步的方式加载贴图，速度会快些，但可能会出现贴图加载完成前模型显示效果不佳的现象
		*	保证模型加载完成后在加载贴图。
		* hu: Human类在new处的名称
		* url_body: body的url
		* url_eye: eyede的url
		* url_eyelashes: 睫毛的url
		* url_diffuse: diffuset贴图的地址
		*	url_specular: specular的贴图地址
		*	url_normal: normal的贴图地址
		*	url_Opacity: opacity的贴图地址
		* url_light: light贴图的地址
		* onload: 加载完成后执行的函数
		*/
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

		var eyes = null;													// 眼睛的模型
		var human = null;													// 身体的模型
		var eyelashes = null;											// 睫毛的模型

		var loadEyes = new THREE.JSONLoader();			// 加载眼睛
		var loadHuman = new THREE.JSONLoader();			// 加载身体
		var loadEyelashes = new THREE.JSONLoader();	// 加载睫毛

		var mater = new THREE.MeshPhongMaterial({		// 测试不同步加载的显示效果
			specular:0xffffff,
			skinning:true,
			alphaTest:0.5
		});

		hu.material = mater;

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

				diffuse.image = image;											// 加载贴图
				diffuse.needsUpdate = true;

				mater.map = diffuse;												// 将贴图加载在材质上
				mater.needsUpdate = true;

				console.log("diffuse贴图加载完成");

		} ,onProgress,onError);			// load diffuse

		loader2.load( url_specular, function ( image ) {		// 读取specular贴图

				specular.image = image;													// 加载贴图
				specular.needsUpdate = true;

				mater.specularMap = specular;										// 将贴图附加给材质
				mater.needsUpdate = true;

				console.log("specular贴图加载完成");

		} ,onProgress,onError);			// load specular

		loader3.load( url_normal, function ( image ) {		// 读取normal贴图

				normal.image = image;													// 加载贴图
				normal.needsUpdate = true;

				mater.normalMap = normal;											// 将贴图附加给材质
				mater.needsUpdate = true;

				console.log("normal贴图加载完成");

		} ,onProgress,onError);			// load normal

		loader4.load( url_Opacity, function ( image ) {		// 读取opacity贴图

				opacity.image = image;						// 加载贴图
				opacity.needsUpdate = true;

				hu.alpha = opacity;		// 将人体最初的透明贴图初始化

				mater.alphaMap = opacity;					// 将贴图追加给材质
				mater.needsUpdate = true;

				console.log("opacity贴图加载完成");

		} ,onProgress,onError);			// load opacity

		loader5.load( url_light, function ( image ) {		// 读取light贴图

				light.image = image;												// 加载贴图
				light.needsUpdate = true;

				mater.lightMap = light;											// 将贴图附加给材质
				mater.lightMapIntensity = 0.9;				// 光照贴图的强度
				mater.shininess = 20;						// 反光
				mater.needsUpdate = true;

				console.log("light贴图加载完成");

		} ,onProgress,onError);			// load light

		var addSkeletonHelper = function(model)							// 用来添加骨架显示
		{
			hu.skeletonhelper = new THREE.SkeletonHelper(model);
			hu.skeletonhelper.linewidth = 10;
			hu.skeletonhelper.visible = false;
			show.addHelper(hu.skeletonhelper);
		};

		loadHuman.load(url_body, function ( geometry, materials ) {				// 加载身体模型

			human = new THREE.SkinnedMesh(geometry, mater);		//	新建衣服模型

			if(hu.skeletonhelper === null) addSkeletonHelper(human);				// 如果骨架助手不存在
			if(eyes !== null)																				// 谁先加载好用谁的骨架
			{
				human.skeleton = hu.eyes.skeleton;
				human.bind(hu.eyes.skeleton, human.matrixWorld);			// 使用眼睛的骨架
			}
			else if(eyelashes !== null)
			{
				human.skeleton = hu.eyelashes.skeleton;
				human.bind(hu.eyelashes.skeleton, human.matrixWorld);
			}
			
			if((eyes !== null && eyelashes !== null))		// 如果其他两个部分都已经加载完成，则全部设为可见
			{
				eyes.visible = true;
				eyelashes.visible = true;
			}
			else
			{
				human.visible = false;
			}
			
			hu.group.add(human);				// 将人体添加到group中,即添加到场景中
			hu.show.signals.objectAdded.dispatch(human);		// 发送加载完成信号量
			hu.human = human;
			
			if(onload != undefined)
				{
				console.log("执行onload",onload);
				if(onload instanceof signals.Signal)
					onload.dispatch();
				}
			
			
			console.log("添加了人体body模型");

		}, onProgress, onError);				// load human

		loadEyes.load(url_eye, function ( geometry, materials ) {				// 加载眼睛模型

			eyes = new THREE.SkinnedMesh(geometry, mater);						//	新建眼睛模型

			if(hu.skeletonhelper === null) addSkeletonHelper(eyes);				// 如果骨架助手不存在
			if(human !== null)																				// 谁先加载好用谁的骨架
			{
				eyes.skeleton = hu.human.skeleton;
				eyes.bind(hu.human.skeleton, eyes.matrixWorld);					// 使用人体的骨架
			}
			else if(eyelashes !== null)
			{
				eyes.skeleton = hu.eyelashes.skeleton;
				eyes.bind(hu.eyelashes.skeleton, eyes.matrixWorld);
			}
			
			if(human !== null && eyelashes !== null)				// 如果其他两个加载完成，则设为可见
			{
				eyes.visible = true;
				human.visible = true;
				eyelashes.visible = true;
			}
			else
			{
				eyes.visible = false;
			}
			
			hu.group.add(eyes);	
			hu.show.signals.objectAdded.dispatch(eyes);		// 发送加载完成信号量
			hu.eyes = eyes;

			console.log("添加了人体eyes模型");

		}, onProgress, onError);				// load human

		loadEyelashes.load(url_eyelashes, function( geometry, materials ){
			eyelashes = new THREE.SkinnedMesh(geometry,mater);		// 新建睫毛模型

			if(hu.skeletonhelper === null) addSkeletonHelper(eyelashes);				// 如果骨架助手不存在
			if(human !== null)
			{
				eyelashes.skeleton = hu.human.skeleton;
				eyelashes.bind(hu.human.skeleton, eyelashes.matrixWorld);
			}
			else if(eyes !== null)
			{
				eyelashes.skeleton = hu.eyes.skeleton;
				eyelashes.bind(hu.eyes.skeleton, eyelashes.matrixWorld);
			}
			
			if(human !== null && eyes !== null)		// 如果全部加载完成，则一起设为可见
			{
				human.visible = true;
				eyes.visible = true;
				eyelashes.visible = true;
			}
			else
			{
				eyelashes.visible = false;
			}
				hu.group.add(eyelashes);
				hu.show.signals.objectAdded.dispatch(eyelashes);	// 发送加载完成信号量
				hu.eyelashes = eyelashes;

		},onProgress, onError);					// load eyelashes



	},			// 	load:function(hu, url_body, url_eye, url_eyelashes,  url_diffuse, url_specular, url_normal, url_Opacity, url_light)
	CMDLoadCloth:function(hu, type, url_cloth, url_diffuse, url_specular, url_normal, url_Opacity, url_light, url_human_alpha)
	{
		this.show.execute(new SetClothCommand(hu, type, url_cloth, url_diffuse, url_specular, url_normal, url_Opacity, url_light, url_human_alpha));
	},

	loadCloth:function(hu, type, url_cloth, url_diffuse, url_specular, url_normal, url_Opacity, url_light, url_human_alpha)
	/**
	* 采用不同步的方式加载贴图和模型
	* 参数说明:
	* hu: 此类在全局中的名称
	* type: 字符串，为衣服类型 "upcloth", "trousers" , "glasses", "shoes", "hair"
	* url_cloth: 衣服路径
	* url_diffuse: diffuse贴图路径
	* url_specular: specular贴图的路径
	* url_normal: normal贴图路径
	* url_Opacity: alpha贴图路径
	* url_light: light贴图路径
	* url_human_alpha:	用来与人体的贴图合并，形成新的透明贴图
	*/
	{
		var mater = new THREE.MeshPhongMaterial({		// 测试不同步加载的显示效果
			specular:0xffffff,
			skinning:true,
			alphaTest:0.5
		});

		var diffuse = new THREE.Texture();	// 读取diffuse贴图
		var specular = new THREE.Texture();		// 读取specular贴图
		var normal = new THREE.Texture();			// 读取normal贴图
		var opacity = new THREE.Texture();		// 读取opacity贴图
		var light = new THREE.Texture();			// 读取光照贴图

		var human_alpha = new THREE.Texture();		// 用来存放新加载的透明贴图

		var loader1 = new THREE.ImageLoader();		// 读取diffuse
		var loader2 = new THREE.ImageLoader();		// 读取specular
		var loader3 = new THREE.ImageLoader();		// 读取normal
		var loader4 = new THREE.ImageLoader();		// 读取opacity
		var loader5 = new THREE.ImageLoader();		// 读取light贴图
		var loader6 = new THREE.ImageLoader();		// 读取人体的透明贴图

		var onProgress = function ( xhr ) {		// 用来调试读取进度
			if ( xhr.lengthComputable ) {
					var percentComplete = xhr.loaded / xhr.total * 100;
					console.log( Math.round(percentComplete, 2) + '% downloaded' );
				}
		};

		var onError = function ( xhr ) {		// 读取错误时执行
			console.log("图片加载错误");
		};

		var addCloth = function(hu, type){

			switch(type)     // 分成几类模型问题讨论
			{
				case 'upcloth':
				if(hu.upcloth != null)	hu.group.remove(hu.upcloth);
				hu.upcloth = cloth;
				console.log('添加上衣');
				break;

				case 'trousers':
				if(hu.trousers != null)	hu.group.remove(hu.trousers);
				hu.trousers = cloth;
				console.log('添加裤子');
				break;

				case 'glasses':
				if(hu.glasses != null)	hu.group.remove(hu.glasses);
				hu.glasses = cloth;
				console.log('添加眼镜');
				break;

				case 'shoes':
				if(hu.shoes != null)	hu.group.remove(hu.shoes);
				hu.shoes = cloth;
				console.log('添加鞋子');
				break;

				case 'hair':
				if(hu.hair != null)	hu.group.remove(hu.hair);
				hu.hair = cloth;
				console.log('添加头发');
				break;

				default:
				console.log("未有匹配项");
			};

		};

		var editAlphaMap = function()												// 因为异步加载的关系，必须等到透明贴图加载完成后再调用这个函数
		{
			switch(type)     // 分成几类模型问题讨论
			{
				case 'upcloth':
				hu.clothAlpha["upcloth"]	=	human_alpha;				// 将透明贴图保存
				hu.mergeAlpha(hu);																// 调用合并贴图函数
				console.log('合成上衣贴图');
				break;

				case 'trousers':
				hu.clothAlpha['trousers'] = human_alpha;				// 将透明贴图保存
				hu.mergeAlpha(hu);																// 调用合并贴图函数
				console.log('合成裤子贴图');
				break;

				case 'shoes':
				hu.clothAlpha['shoes'] = human_alpha;							// 将透明贴图保存
				hu.mergeAlpha(hu);																	// 调用合并贴图函数
				console.log('添加鞋子');
				break;

				default:
				console.log("未有匹配项");
			};
		};

		loader1.load( url_diffuse, function ( image ) {		// 读取diffuse贴图

				diffuse.image = image;
				diffuse.needsUpdate = true;

				mater.map = diffuse;												// 将贴图加载在材质上
				mater.needsUpdate = true;

				console.log("diffuse贴图加载完成");

		} ,onProgress,onError);			// load diffuse

		loader2.load( url_specular, function ( image ) {		// 读取specular贴图

				specular.image = image;
				specular.needsUpdate = true;
				mater.specularMap = specular;
				mater.needsUpdate = true;

				console.log("specular贴图加载完成");

		} ,onProgress,onError);			// load specular

		loader3.load( url_normal, function ( image ) {		// 读取normal贴图

				normal.image = image;
				normal.needsUpdate = true;
				mater.normalMap = normal;
				mater.needsUpdate = true;

				console.log("normal贴图加载完成");

		} ,onProgress,onError);			// load normal

		loader4.load( url_Opacity, function ( image ) {		// 读取opacity贴图

				opacity.image = image;
				opacity.needsUpdate = true;
				mater.alphaMap = opacity;
				mater.needsUpdate = true;

				console.log("opacity贴图加载完成");

		} ,onProgress,onError);			// load opacity

		loader5.load( url_light, function ( image ) {		// 读取light贴图

				light.image = image;
				light.needsUpdate = true;
				mater.lightMap = light;
				mater.needsUpdate = true;

				console.log("light贴图加载完成");

		} ,onProgress,onError);			// load light

		loader6.load( url_human_alpha, function ( image ) {		// 读取human_alpha贴图

				human_alpha.image = image;
				human_alpha.needsUpdate = true;
				editAlphaMap();														// 贴图加载完成，开始合成贴图
				console.log("human_alpha贴图加载完成");

		} ,onProgress,onError);			// load normal

		var jsonloader = new THREE.JSONLoader();
		var cloth = null;
		jsonloader.load( url_cloth, function ( geometry, materials ) {				// 加载衣服模型，使用上面加载的衣服

			cloth = new THREE.SkinnedMesh(geometry, mater);		//	新建衣服模型
			cloth.bind(hu.human.skeleton, cloth.matrixWorld);			// 将人体模型的骨架绑定在衣服上
			hu.group.add(cloth);
			addCloth(hu, type);

			console.log("添加了衣服模型");

		},onProgress,onError);						// load eyes



	},				// loadCloth:function(hu, type, url_cloth, url_diffuse, url_specular, url_normal, url_Opacity, url_light)

	loadCloth_backup:function(hu, type, url_cloth, url_diffuse, url_specular, url_normal, url_Opacity, url_light)
	/**
	* 采用不同步的方式加载贴图和模型
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
		var mater = new THREE.MeshPhongMaterial({		// 测试不同步加载的显示效果
			specular:0xffffff,
			skinning:true,
			alphaTest:0.5
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

		var addCloth = function(hu, type){

			switch(type)     // 分成几类模型问题讨论
			{
				case 'upcloth':
				if(hu.upcloth != null)	hu.group.remove(hu.upcloth);
				hu.upcloth = cloth;
				console.log('------------添加到了human成分');
				break;

				case 'trousers':
				if(hu.trousers != null)	hu.group.remove(hu.trousers);
				hu.trousers = cloth;
				break;

				case 'glasses':
				if(hu.glasses != null)	hu.group.remove(hu.glasses);
				hu.glasses = cloth;
				break;

				case 'shoes':
				if(hu.shoes != null)	hu.group.remove(hu.shoes);
				hu.shoes = cloth;
				break;

				case 'hair':
				if(hu.hair != null)	hu.group.remove(hu.hair);
				hu.hair = cloth;
				break;

				default:
				console.log("未有匹配项");
			};

		};

		loader1.load( url_diffuse, function ( image ) {		// 读取diffuse贴图

				diffuse.image = image;
				diffuse.needsUpdate = true;

				mater.map = diffuse;												// 将贴图加载在材质上
				mater.needsUpdate = true;

				console.log("diffuse贴图加载完成");

		} ,onProgress,onError);			// load diffuse

		loader2.load( url_specular, function ( image ) {		// 读取specular贴图

				specular.image = image;
				specular.needsUpdate = true;
				mater.specularMap = specular;
				mater.needsUpdate = true;

				console.log("specular贴图加载完成");

		} ,onProgress,onError);			// load specular

		loader3.load( url_normal, function ( image ) {		// 读取normal贴图

				normal.image = image;
				normal.needsUpdate = true;
				mater.normalMap = normal;
				mater.needsUpdate = true;

				console.log("normal贴图加载完成");

		} ,onProgress,onError);			// load normal

		loader4.load( url_Opacity, function ( image ) {		// 读取opacity贴图

				opacity.image = image;
				opacity.needsUpdate = true;
				mater.alphaMap = opacity;
				mater.needsUpdate = true;

				console.log("opacity贴图加载完成");

		} ,onProgress,onError);			// load opacity

		loader5.load( url_light, function ( image ) {		// 读取light贴图

				light.image = image;
				light.needsUpdate = true;
				mater.lightMap = light;
				mater.needsUpdate = true;

				console.log("light贴图加载完成");

		} ,onProgress,onError);			// load light

		var jsonloader = new THREE.JSONLoader();
		var cloth = null;
		jsonloader.load( url_cloth, function ( geometry, materials ) {				// 加载衣服模型，使用上面加载的衣服

			cloth = new THREE.SkinnedMesh(geometry, mater);		//	新建衣服模型
			cloth.bind(hu.human.skeleton, cloth.matrixWorld);			// 将人体模型的骨架绑定在衣服上
			hu.group.add(cloth);
			addCloth(hu, type);

			console.log("添加了衣服模型");

		},onProgress,onError);						// load eyes



	},				// loadCloth:function(hu, type, url_cloth, url_diffuse, url_specular, url_normal, url_Opacity, url_light)

	addMixer:function(hu)					// 加载动画
	{
		if(hu.human ===null)	return;															// 在人体构建之前不能使用此函数
		hu.mixer = new THREE.AnimationMixer( hu.human );
		hu.clipaction =  hu.mixer.clipAction(hu.human.geometry.animations[0]);

		hu._clock = new THREE.Clock;															// 新建时钟
	},			// addMixer:function()

	update:function(hu)																										// 将需要update的函数放在这里
	{
			if(hu.mixer !== null)										// 如果定义了mixer
			{
				hu.mixer.update(hu._clock.getDelta());					// 动画需要播放
			}
			if(hu.skeletonhelper)
			{
				//console.log("骨架刷新了");
				hu.skeletonhelper.update();							// 骨架需要更新
			}
	},

	playSpeed:function(scale)					// 默认为1.0 ，为-1.0时可以倒着播放动画
	{
		if(this.mixer)
				this.mixer.timeScale = scale;
	},

	remove:function()									// 从场景中移除所有模型
	{
		if(this.group != null)
		show.removeObject(show, this.group);
	},				// remove:function()

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
	};			// var initHeightArray = function(hu)


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
	};			// var initFingerArray = function(hu)

	initHeightArray(hu);					// 初始化高度的变形数组
	initFingerArray(hu);					// 初始化肥胖的变形数组

	//show.addObject(hu.group);			// 原始作法，加入撤销恢复功能后会丢弃这种做法
	show.execute(new AddObjectCommand(hu.group));
},			// init:function(hu)


	adjustHeight:function(hu, scale)												// hu是Human在new时的名字
	//	用于调整身高，scale 范围0-1.0 ， 尽量控制数值小一些
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
	},			// adjustHeight:function(hu, scale)

	adjustFigure:function(hu, scale)
	//	用于调整肥胖度， scale 的范围0-1.0 , 尽量控制数值小一点
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
	},			// adjustFigure:function(hu, scale)

	adjustHuman:function(hu)															// hu是Human在new时的名字
	//	调用这个函数才会把调整过的体型体现出来
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
	},				// adjustHuman:function(hu)

	mergeAlpha:function(hu)
	{
		var tex = null;
		var tool = new MergeAlphaMap();
		tex = hu.alpha;
		if(hu.clothAlpha['upcloth'])														// 如果添加了贴图,就将贴图合并，生成新的贴图
			tex = tool.merge_1024(tex, hu.clothAlpha['upcloth']);
		if(hu.clothAlpha['trousers'])
			tex = tool.merge_1024(tex, hu.clothAlpha['trousers']);
		if(hu.clothAlpha['shoes'])
			tex = tool.merge_1024(tex, hu.clothAlpha['shoes']);

		return tex;		// 将合成后的贴图作为返回值
		

	},				// mergeAlpha:function()
	
	mergeAlpha_0815:function(hu)
	{
		var tex = null;
		var tool = new MergeAlphaMap();
		tex = hu.alpha;
		if(hu.clothAlpha['upcloth'])		// 如果添加了贴图,就将贴图合并，生成新的贴图
			tex = tool.merge_1024(tex, hu.clothAlpha['upcloth']);
		if(hu.clothAlpha['trousers'])
			tex = tool.merge_1024(tex, hu.clothAlpha['trousers']);
		if(hu.clothAlpha['shoes'])
			tex = tool.merge_1024(tex, hu.clothAlpha['shoes']);

		hu.material.alphaMap = tex;				// 合成后的贴图附加在human材质上
		hu.material.needsUpdate = true;

	},				// mergeAlpha:function()


}
