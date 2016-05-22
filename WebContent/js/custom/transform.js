/**
 * @author Chaoqun
 * @功能 控制Show中处于被选择状态的object
 */

 var transform = function(show)
 {
        this.control = new THREE.TransformControls( show.camera, show.renderer.domElement );       // 给场景加上控制器
		    this.stats = true;

        console.log("这句话执行了");
        show.scene.add(this.control);
        if(show.selected !== null)
        this.control.attach(show.selected);
 };

 transform.prototype = {

   // 调用时，参数为自身在全局中的索引
   init:function(trans)
   {
     window.addEventListener( 'keydown', function ( event )
     {

     switch ( event.keyCode )
     {

       case 81: // Q
         trans.control.setSpace( trans.control.space === "local" ? "world" : "local" );
         break;

       case 17: // Ctrl
    	   trans.control.setTranslationSnap( 100 );
         trans.control.setRotationSnap( THREE.Math.degToRad( 15 ) );
         break;

       case 87: // W
         trans.control.setMode( "translate" );
         break;

       case 69: // E
         trans.control.setMode( "rotate" );
         break;

       case 82: // R
         trans.control.setMode( "scale" );
         break;

       case 187:
       case 107: // +, =, num+
         trans.control.setSize( trans.control.size + 0.1 );
         break;

       case 189:
       case 109: // -, _, num-
         trans.control.setSize( Math.max( trans.control.size - 0.1, 0.1 ) );
         break;

     }

   });

   window.addEventListener( 'keyup', function ( event ) {

     switch ( event.keyCode ) {

       case 17: // Ctrl
         trans.control.setTranslationSnap( null );
         trans.control.setRotationSnap( null );
         break;

     }

   });
 },

 selectTarget:function(mesh)
 {
   this.control.attach(mesh);
 },

 update:function()        // 加在动画上
 {
   this.control.update();
 },

 work:function()          // 开始工作或是停止工作，开始工作时会默认选择 show.selected
 {
   if(this.stats === true)
   {
     this.control.detach();
     this.stats = false;
     show.cameraControl.enable = true;
   }
   else
   {
     this.control.attach(show.selected);
     this.stats = true;
     show.cameraControl.enable = false;
   }

 }

 };
