/**
 * 	@author 	Chaoqun
 */
 var Show = function()    // 建立一个类，容括了render , scene 等东西
 {
   this.name = "Show";

   this.renderer = null;                      // 初始化时进行赋值
   this.ctrlMode  = 1;                         // 设计一个控制器的模式问题
   // 0 ：停止控制器, 1 : 正常使用控制器, 2 : 停止上下角度调节，只允许左右旋转, 3 : 限制上下调节角度的浏览
   this.cameraControl = null;

   this.scene = new THREE.Scene();            // 场景
   this.camera  = null;   // 相机

   this.counter_helper = 0;
   this.counter_geometry = 0;
   this.counter_material = 0;

   this.helper = [];                // 存贮场景中这类物品的数组
  //  this.geometry = [];              // 存储场景中这类物品的数组
  //  this.material = [];              // 存储场景中这类物品的数组
   this.mesh = [];                  // 存储场景中这类物品的数组
   /**
   *  考虑每个元素为
   * {
   *  mesh:     THREE.Group / Mesh / SkinnedMesh
   *  materials: [] 存放该mesh 的所有材质
   *  id:        数字 表示当前用的是第几个material
   * }
   */
  //  this.group = [];                 // 一个模型有多个部分时
   this.light = [];                 // 光
   this.selected = null;            // 指向被选择的object

   this.history = [];               // 之后用来存储历史纪录
   this.loader = null;              // 用来读取任意格式的模型, 结合fileInput使用
   /**
   *  	fileInput = document.createElement( 'input' );
   *  	fileInput.type = 'file';
   *  	fileInput.addEventListener( 'change', function ( event ) {
   *
   * 	  show.loader.loadFile( fileInput.files[ 0 ] );
   *
   *	  } );
   */



 };

 Show.prototype = {
   /**
   * parameters:
   * width:       想设置的renderer的宽
   * height:      想设置的renderer的高
   * camera_position THREE.Vector3 相机的位置
   */
   init:function(width, height, camera_position){
     // 需要给定大小初始化renderer

     // 加载模型到场景
     this.loader = new Loader(this);

     // 定义WebGLRenderer
     if(this.renderer === null) // 如果未定义
        this.renderer = new THREE.WebGLRenderer({
          canvas:document.getElementById("canvas"),
		      antialias:true,
		      precision:THREE.highp
  });
        this.renderer.setSize( width, height );
	      this.renderer.setClearColor(0xEEEEEE);

        // 初始化camera
        this.camera  = new  THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
        if(camera_position === undefined)
        {
          this.camera.position.x = 5;
          this.camera.position.y = 5;
          this.camera.position.z = 5;
        }
        else {
          this.camera.position = camera_position;
        }

        // 定义相机控制器
        this.cameraControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);	//创建控制器
//        this.cameraControl.enable = true;                           // 是否开启控制器, 在一些操作时需要关闭控制器，操作结束后再打开 , 貌似有buffergeometry
//        this.cameraControl.minDistance = 5.0;                      // 设置最远最近
//        this.cameraControl.maxDistance = 200.0;
//        this.cameraControl.minPolarAngle = Math.PI/5;               // 设置视角极限
//        this.cameraControl.maxPolarAngle = 2/3 * Math.PI;
//        this.cameraControl.enablePan = false;                       // 拒绝移动控制器中心
        this.zoomSpeed = 1.0;                                       // 缩放速度
        this.rotateSpeed = 1.0;                                     // 旋转速度
        this.cameraControl.target = new THREE.Vector3(0,2,0);     // 设置中心


     if(this.scene  === null)
        this.scene = new THREE.Scene();

        // 这个小正方形是用来测试的
        // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // var cube = new THREE.Mesh( geometry, material );
        // this.selected = cube;
        // this.addObject(cube);


   },

   onwindowresize:function(windth, height)                        // 在外界进行赋值，因为比例由UI决定
   {
     this.camera.aspect = windth / height;
     this.camera.updateProjectionMatrix();
     this.renderer.setSize(windth, height);
     document.getElementById('canvas').width = windth;
     document.getElementById('canvas').height = height;

   },

   update:function()                                                // 用来渲染场景
   {

     	this.renderer.render( this.scene, this.camera );
      this.cameraControl.update();
   },

   add:function(object)
   {
     if(object instanceof THREE.Mesh || object instanceof THREE.SkinnedMesh)
        {
          this.mesh.push(object);
        }
      else if(object instanceof THREE.Group)
      {
        this.group.push(object);
      }

    this.scene.add(object);
  },

  addObject: function ( object ) {

		var scope = this;

		// object.traverse( function ( child ) {
    //
		// 	if ( child.geometry !== undefined ) scope.addGeometry( child.geometry );
		// 	if ( child.material !== undefined ) scope.addMaterial( child.material );
    //
		// 	scope.addHelper( child );
    //
		// } );
    // 添加到数组中存储
    if(object !== undefined)
    {
      this.mesh[object.uuid]=
      {
        mesh: object,
        materials: [object.materials],
        id:0
      };             // 在mesh中添加纪录，顺便可以记录更换material的情况
      this.scene.add( object );
      this.selected = object;
      console.log("模型已经添加到场景");
    }

	},
  addHelper:function(object)
  {
    if(object !== undefined)
    {
      this.helper[object.uuid] = object;
      this.scene.add(object);
      console.log("helper已经添加到了场景中");
    }
  },

   load:function(filename)
   {
      this.loader.loadFile(filename);
   }

 };
