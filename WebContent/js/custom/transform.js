/**
 * @author Chaoqun
 * @功能 控制Show中处于被选择状态的object
 */

 var transform = function(show)
 {
        this.control = new THREE.TransformControls( show.camera, show.renderer.domElement );       // 给场景加上控制器
		    this.stats = true;

        //console.log("这句话执行了");
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

  //  trans.control.addEventListener( 'change', function () {
	// 	var object = trans.control.object;
	// 	if ( object !== undefined ) {
	// 		// selectionBox.update( object );
	// 		// if ( editor.helpers[ object.id ] !== undefined ) {
	// 		// 	editor.helpers[ object.id ].update();
	// 		// }
	// 		//signals.refreshSidebarObject3D.dispatch( object );
	// 	}
	// 	//render();
	// } );

  var objectPositionOnDown = null;
	var objectRotationOnDown = null;
	var objectScaleOnDown = null;

	trans.control.addEventListener( 'mouseDown', function () {
		var object = trans.control.object;

		objectPositionOnDown = object.position.clone();
		objectRotationOnDown = object.rotation.clone();
		objectScaleOnDown = object.scale.clone();

		show.cameraControl.enabled = false;

	} );

	trans.control.addEventListener( 'mouseUp', function () {
		var object = trans.control.object;
		if ( object !== null ) {
			switch ( trans.control.getMode() ) {

				case 'translate':
					if ( ! objectPositionOnDown.equals( object.position ) ) {
						show.execute( new SetPositionCommand( object, object.position, objectPositionOnDown ) );
					}
					break;

				case 'rotate':
					if ( ! objectRotationOnDown.equals( object.rotation ) ) {
						show.execute( new SetRotationCommand( object, object.rotation, objectRotationOnDown ) );
					}
					break;

				case 'scale':
					if ( ! objectScaleOnDown.equals( object.scale ) ) {
						show.execute( new SetScaleCommand( object, object.scale, objectScaleOnDown ) );
					}
					break;
			}          // switch ( trans.control.getMode() )
		}   // if ( object !== null )
		show.cameraControl.enabled = true;
	} );   // 	trans.control.addEventListener

 },

 selectTarget:function(mesh)
 {
   this.control.attach(mesh);
 },

 update:function()        // 加在动画上
 {
   if(show.selectNeedUpdate)
   {
     show.selectNeedUpdate = false;
     if(this.stats === true)
     {
       if(show.selected !=null)               // 因为,可能会因为撤销
       {
          this.control.attach(show.selected);
       }
       else {
         this.control.detach();
       }

     }      // if(this.stats === true)

   }      // if(show.selectNeedUpdate)
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
