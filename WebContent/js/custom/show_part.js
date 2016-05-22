/**
 * 新建一个场景
 * @author Chaoqun
 */

	var winWidth, winHeight;		// 画板的大小
	var canvas, scene, camera;		// 画板 场景 相机
	var renderer, stats;			// 渲染器及帧数显示器
	var axes ;						// 坐标轴
	var clock, cameraControls;		// 时钟和轨迹球控制器
	var dtrectionalLight;			// 平行光线
	var gridHelper;					// 网格助手
	var objloader;					// objloader
	var delta;						// 用来获取时间
	var control;					// 测试移动插件
	var model,mixer,bonesClip;		// 动画部分
	var helper;						// 显示骨骼的工具
	var action;						// 动作
	var play;						// 播放状态
	
	function onWindowResize() //重置窗口大小
	{
		camera.aspect = window.innerWidth / window.innerHeight;			// 重置相机比例
		camera.updateProjectionMatrix();								//

		renderer.setSize(window.innerWidth, window.innerHeight);		// 重置渲染的大小

		doucument.getElementById('canvas').width = window.innerWidth;
		doucument.getElementById('canvas').height = window.innerHeight;
	}
	
	function init()
	{
		canvas = document.getElementById('canvas');					// 创建一个canvas
		scene = new THREE.Scene();									// 创建一个scene
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );	// 创建相机
		// 设置相机初始位置，使其正对着模型
		camera.position.z = 20/100;
		camera.position.x = 0;
		camera.position.y = 10/100;

			renderer = new THREE.WebGLRenderer({canvas:document.getElementById('canvas'),
			antialias:true,
			precision:THREE.highp });					//创建一个渲染器
		renderer.setSize( window.innerWidth, window.innerHeight );		//设置渲染器渲染范围
		renderer.setClearColor(0xEEEEEE);
		play = false;
	}
	
	function addstats()		// 添加状态显示模块，在init之后执行
	{
		stats = new Stats();									// 新建一个状态显示器
		stats.setMode(0);										// 设置为默认显示fps
		// 设置stats的位置s
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top	 = '0px';
		document.body.appendChild(stats.domElement);			// 添加到页面中
	}

	function addListener()		// 用来统一添加监听器
	{
		window.addEventListener('resize', onWindowResize, false);	// 添加监听器，用来监听窗口变化
//	 	window.addEventListener( 'keydown', function ( event ) {

//	 		switch ( event.keyCode ) {

//	 			case 81: // Q
//	 				control.setSpace( control.space === "local" ? "world" : "local" );
//	 				break;

//	 			case 17: // Ctrl
//	 				control.setTranslationSnap( 100 );
//	 				control.setRotationSnap( THREE.Math.degToRad( 15 ) );
//	 				break;

//	 			case 87: // W
//	 				control.setMode( "translate" );
//	 				break;

//	 			case 69: // E
//	 				control.setMode( "rotate" );
//	 				break;

//	 			case 82: // R
//	 				control.setMode( "scale" );
//	 				break;

//	 			case 187:
//	 			case 107: // +, =, num+
//	 				control.setSize( control.size + 0.1 );
//	 				break;

//	 			case 189:
//	 			case 109: // -, _, num-
//	 				control.setSize( Math.max( control.size - 0.1, 0.1 ) );
//	 				break;

//	 		}

//	 	});

//	 	window.addEventListener( 'keyup', function ( event ) {

//	 		switch ( event.keyCode ) {

//	 			case 17: // Ctrl
//	 				control.setTranslationSnap( null );
//	 				control.setRotationSnap( null );
//	 				break;

//	 		}

//	 	});

	}


	function addTrackball()		// 用来添加轨迹球控制器
	{
		// TrackballControls 设置一个轨迹球操作器
		clock = new THREE.Clock();
		cameraControls = new THREE.TrackballControls(camera,renderer.domElement);			// 定义相机控制器
		cameraControls.target.set(0, 10/100, 0);													// 设置中心点坐标
		cameraControls.zoomSpeed = 1.0;								// 设置缩放速度
		cameraControls.rotateSpeed = 1.0;
		cameraControls.panSpeed = 1.0;
		cameraControls.noPan = true;								// 不让移动
		cameraControls.dynamicDampingFactor = 0.5;					// 设置阻尼效果，可以改变鼠标拖动时操作的灵敏度
		//cameraControls.minDistance = 10.0;							// 设置最近距离，可以使相机不要过分的接近
		//cameraControls.maxDistance = 200.0;							// 设置最远距离，可以使相机不要过分的远离
	}

	function addTransform()			// 添加移动帮助
	{
		control = new THREE.TransformControls( camera, renderer.domElement );	// 构造函数
		//control.addEventListener( 'change', animation );

		var geometry = new THREE.BoxGeometry( 200, 200, 200 );
		var material = new THREE.MeshLambertMaterial( { Color: 0xff0000 } );
		var mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		control.attach( mesh );
		scene.add( control );
	}

	function addLight()			// 添加光线
	{
		directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
		directionalLight.position.set(1,1, 1);						// 设置光线方向
		//directionalLight.shadowCameraVisble = true;
		scene.add(directionalLight);
	}

	function addGrid()			// 添加网格
	{
		var size = 10;
		var step = 0.5;
		gridHelper = new THREE.GridHelper(size, step);		// 添加一个网格助手
		scene.add(gridHelper);
	}

	function loadjson()			// 读取一个JSON模型
	{
		var loader = new THREE.JSONLoader();

		loader.load('models/16test1.json', function (geometry, materials) {
			//alert(geometry instanceof THREE.Geometry);				// 结论，此处是geometry类型的
			//alert(geometry instanceof THREE.BufferGeometry);
			
//	 		for (var i = 0; i < geometry.vertices.length; i++) 
//	 		{
//	                 vector = geometry.vertices[i];
//	                 var axis = new THREE.Vector3(0, 1, 0);
//	                 var angle = Math.PI / 2;
//	                 geometry.vertices[i].applyAxisAngle(axis, angle);
//	                 geometry.vertices[i].multiplyScalar(0.01);
//	  		}
	 
		    model = new THREE.SkinnedMesh(
		    		geometry,
		    		new THREE.MeshLambertMaterial({color:0xaaaaaa,
		    			skinning:true
		    			}));
		    model.scale.set(1,1,1);
		    scene.add(model);
		    // alert("hh");
		    model.visible = true;						// 测试能否导入骨架信息

		    helper = new THREE.SkeletonHelper( model );
			helper.material.linewidth = 10;
			helper.visible = true;
			scene.add( helper );

			mixer = new THREE.AnimationMixer(model);
			if(model.geometry.animations[0] )
			{
				bonesClip = model.geometry.animations[0];
				action = mixer.clipAction(bonesClip,model);
				action.play();
			}
		});

	}

	function render()
	{

		renderer.render( scene, camera );					// 渲染相机和场景
		stats.update();										// 更新
		if(play)
			{
				delta = clock.getDelta();							// 获取时间
				mixer.update(  0.01*delta );
				
				document.getElementById('times').innerHTML = action.time;
			}
		if(mixer)
		helper.update();
	}

	function cameraCtrl()
	{
		delta = clock.getDelta();							// 获取时间
		cameraControls.update(delta);						// 更新


	}

	function animation()			// 动画
	{
		requestAnimationFrame( animation );					// 要求定时渲染
		render();
		cameraCtrl();										// 鼠标控制
		//control.update();
	}
	
	function main()
	{
		init();					// 初始化窗口
		addListener()			// 添加监听器
		addstats();				// 添加状态显示
		addTrackball();			// 添加轨迹球控制器
		//load();					// 添加模型
		loadjson();				// 读取JSON模型
		addLight();				// 添加光线
		addGrid();				// 添加网格
		animation();			// 调用动画
		//addTransform();			// 添加移动帮助

	}
	
	
	main();						//为了更清晰的理清逻辑，建立一个main函数,在窗口打开后执行一次