/**
 * 	@author 	Chaoqun
 */
 var Show = function()    // 建立一个类，容括了render , scene 等东西
 {

   var SIGNALS = signals;

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

   this.helper = [];                // 存贮场景中这类物品的数组s
  //  this.geometry = [];              // 存储场景中这类物品的数组
  //  this.material = [];              // 存储场景中这类物品的数组
   this.objects = [];                  // 存储场景中这类物品的数组

   this.light = [];                 // 光
   this.selected = null;            // 指向被选择的object

   this.history = new History(this);               // 之后用来存储历史纪录
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

   this.signals = {                         // 事件监听器
      objectSelected: new SIGNALS.Signal(),			// 有物体被选中信号
      objectChanged: new SIGNALS.Signal(),			// 有物体被改动
      materialChanged: new SIGNALS.Signal(),		// 改动材质
      refreshSidebarObject3D: new SIGNALS.Signal(),	// 刷新侧边栏
      
      objectAdded: new SIGNALS.Signal(),			// 增添模型时，需要刷新射线的objects数组
  	  objectRemoved: new SIGNALS.Signal(),			// 模型被移除时也需要进行刷新数组处理
  	  transformModeChanged: new SIGNALS.Signal(),	// 改变移动控制器模式
  	  spaceChanged: new SIGNALS.Signal()
   	  
   };



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
        this.camera  = new  THREE.PerspectiveCamera( 75, width / height, 0.1, 8000 );
        if(camera_position === undefined)
        {
          this.camera.position.x = 0.03;
          this.camera.position.y = 0.9;
          this.camera.position.z = 1.7;
        }
        else {
          this.camera.position = camera_position;
        }

        // 定义相机控制器
        this.cameraControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);	//创建控制器
        this.cameraControl.enable = true;                           // 是否开启控制器, 在一些操作时需要关闭控制器，操作结束后再打开 , 貌似有buffergeometry
        this.cameraControl.minDistance = 1.0;                      // 设置最远最近
        this.cameraControl.maxDistance = 15.0;
        this.cameraControl.minPolarAngle = Math.PI/5;               // 设置视角极限
        this.cameraControl.maxPolarAngle = 2/3 * Math.PI;
        this.cameraControl.enablePan = true;                       // 拒绝移动控制器中心
        this.zoomSpeed = 1.0;                                       // 缩放速度
        this.rotateSpeed = 1.0;                                     // 旋转速度
        this.cameraControl.target = new THREE.Vector3(0,0.8,0);     // 设置中心


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

   },     // onwindowresize:function(windth, height)

   update:function()                                                // 用来渲染场景
   {

     	this.renderer.render( this.scene, this.camera );
     	this.cameraControl.update();

   },     // update:function()

  addObject: function ( object ) {

		var scope = this;		// 底下有递归，this指向发生改变

    // 添加到数组中存储
    if(object !== undefined)
    {
    	object.traverse( function ( child ) {
			
			if(child instanceof THREE.Bone) return;
			scope.objects.push( child );

		} );
      this.scene.add( object );

      //this.signals.objectSelected.dispatch(object);         // 发布选择物体信号
      this.signals.objectAdded.dispatch(object);			// 发布添加物体信号
      
      console.log("模型已经添加到场景",object);
    }

	},     // addObject: function ( object )

  addHelper:function(object)
  {
    if(object !== undefined)
    {
      this.helper[object.uuid] = object;
      this.scene.add(object);
      console.log("helper已经添加到了场景中");
    }
  },        // addHelper:function(object)

   load:function(filename)
   {
      this.loader.loadFile(filename);
   },   // load:function(filename)

   removeObject:function(show, object)                    // show是当前类在全局中的名称
   {
	 if ( object.parent === null ) return; 	// avoid deleting the camera or scene
     if(object == null) return;                           // 如果模型不存在，就不去移除
     show.scene.remove(object);							  // 从场景中删除物体
     
     object.traverse( function ( child ) {

			show.objects.splice( show.objects.indexOf( child ), 1 );

		} );
     
     show.signals.objectRemoved.dispatch(object);
     show.select(null);				// 万一删除的是正在选择的物体
   },       // removeObject:function(show, object)

   removeSelected:function(show)                        // show代指当前场景
   {
     show.removeObject(show, show.selected);
     show.selected = null;
     show.selectNeedUpdate = true;
   },   // removeSelected:function()

   execute: function ( cmd, optionalName )
   {

		   this.history.execute( cmd, optionalName );

   },     // execute: function ( cmd, optionalName )

   undo:function()
   {
      this.history.undo();
   },   // undo:function()

   redo:function()
   {
      this.history.redo();
   },   // redo:function()

   select:function(object)
   {
	  if(this.selected == object) return;				// 如果选中的物体是同一个，或者是一直没有选中新物体
      this.selected = object;     						// 暂且默认这个模型是场景内的
      this.signals.objectSelected.dispatch(object);		// 发送选中物体信号
   },       // select:function(object)

   isIncluded:function(object)                // 未测试
   {
     for(var i = 0 ; i < this.objects.length; i++)
     {
       if (this.objects[i] == object)
        return true;
        if(this.objects[i] instanceof THREE.Group )  // 如果是group，要判断每个元素
        {
          for(var j = 0; j <this.objects[i].children.length; j++)
          {
            if (this.objects[i].children[j] == object)
             return true;
          }     // for(var j = 0; j <this.objects[i].children.length; j++)
        }     // if(this.objects[i] instanceof THREE.Group )
     }      // for(var i = 0 ; i < this.objects.length; i++)
     return false;

   },       // isIncluded:function(object)

 };
