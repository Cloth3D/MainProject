/**
 * MoveAndChooseManager
 * 用来管理移动工具和射线工具
 * @author Chaoqun http://www.mcoder.cc/
 */
var MoveAndChooseManager = function(show){
	this.show = show;
	var signals = show.signals;				// 信号量
	var camera = show.camera;
	var scene = show.scene;
	var container = document.getElementById("canvas");			// canvas dom
	
	var objects = [];
	
	var transformControls = new THREE.TransformControls( camera, container );
	
	transformControls.addEventListener( 'change', function () {		// 这是因为物体发生了变化，如果有提示框等信息，需要更新显示

		var object = transformControls.object;

		if ( object !== undefined ) {

			//selectionBox.update( object );

			//if ( editor.helpers[ object.id ] !== undefined ) {

				//editor.helpers[ object.id ].update();
			// 这里是刷新,辅助工具的显示
			
			//}

			//signals.refreshSidebarObject3D.dispatch( object );

		}

		render();

	} );
	transformControls.addEventListener( 'mouseDown', function () {

		var object = transformControls.object;

		objectPositionOnDown = object.position.clone();
		objectRotationOnDown = object.rotation.clone();
		objectScaleOnDown = object.scale.clone();

		show.cameraControl.enabled = false;

	} );
	
	transformControls.addEventListener( 'mouseUp', function () {

		var object = transformControls.object;

		if ( object !== null ) {

			switch ( transformControls.getMode() ) {

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

			}
			render();

		}

		show.cameraControl.enabled = true;

	} );
	show.addHelper(transformControls);			// 显示助手
	
	window.addEventListener( 'keydown', function ( event )
		     {

		     switch ( event.keyCode )
		     {

		       case 81: // Q  切换助手模式为局部或是全局
		    	   transformControls.setSpace( transformControls.space === "local" ? "world" : "local" );
		         break;

		       case 17: // Ctrl  使
		    	   transformControls.setTranslationSnap( 100 );
		    	   transformControls.setRotationSnap( THREE.Math.degToRad( 15 ) );
		         break;

		       case 87: // W     切换模式为移动
		    	   transformControls.setMode( "translate" );
		         break;

		       case 69: // E	 切换模式为旋转
		    	   transformControls.setMode( "rotate" );
		         break;

		       case 82: // R	切换模式为缩放
		    	   transformControls.setMode( "scale" );
		         break;

		       case 187:
		       case 107: // +, =, num+
		    	   transformControls.setSize( transformControls.size + 0.1 );
		         break;

		       case 189:
		       case 109: // -, _, num-
		    	   transformControls.setSize( Math.max( transformControls.size - 0.1, 0.1 ) );
		         break;

		     }
		     render();

		   });

		   window.addEventListener( 'keyup', function ( event ) {

		     switch ( event.keyCode ) {

		       case 17: // Ctrl
		    	   transformControls.setTranslationSnap( null );
		    	   transformControls.setRotationSnap( null );
		         break;

		     }
		     render();

		   });
	
	// object picking

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();

	// events

	function getIntersects( point, objects ) {

		mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );
		//console.log(mouse);
		raycaster.setFromCamera( mouse, camera );

		return raycaster.intersectObjects( objects );

	}

	var onDownPosition = new THREE.Vector2();
	var onUpPosition = new THREE.Vector2();
	var onDoubleClickPosition = new THREE.Vector2();

	function getMousePosition( dom, x, y ) {		// 获得可以用于raycaster的鼠标坐标信息

		var rect = dom.getBoundingClientRect();
		//console.log(rect);
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

	}

	function handleClick() {							// 用来处理点击事件

		if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {	// 如果点击鼠标和抬起鼠标位置相同

			var intersects = getIntersects( onUpPosition, objects );// 获得相交的模型

			if ( intersects.length > 0 ) {

				var object = intersects[ 0 ].object;				// 获得与射线相交的第一个模型 

				show.select(object);		// 选中物体

			} else {

				show.select( null );		// 没有选中物体的话

			}
			//console.log("objects数组",objects)
			//console.log("相交数组",intersects);
			render();

		}

	}

	function onMouseDown( event ) {

		event.preventDefault();

		var array = getMousePosition( container, event.clientX, event.clientY );	// 获得鼠标坐标
		onDownPosition.fromArray( array );			// 将鼠标坐标转化成 Vector2类型
		
		document.addEventListener( 'mouseup', onMouseUp, false );	// 点下鼠标时添加该监听器，抬起鼠标后要取消

	}

	function onMouseUp( event ) {

		var array = getMousePosition( container, event.clientX, event.clientY );
		onUpPosition.fromArray( array );

		handleClick();		// 在抬起鼠标时，处理点击事件

		document.removeEventListener( 'mouseup', onMouseUp, false );	// 取消该监听器

	}

	function onTouchStart( event ) {		// 开始触摸

		var touch = event.changedTouches[ 0 ];		

		var array = getMousePosition( container, touch.clientX, touch.clientY );
		onDownPosition.fromArray( array );		// 转化成 Vector2

		document.addEventListener( 'touchend', onTouchEnd, false );	// 添加触摸结束监听器

	}

	function onTouchEnd( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container, touch.clientX, touch.clientY );
		onUpPosition.fromArray( array );

		handleClick();			// 在抬起手后处理点击事件

		document.removeEventListener( 'touchend', onTouchEnd, false );	// 取消触摸结束监听器

	}

	function onDoubleClick( event ) {		// 处理双击事件，双击时也要检测是否有射线相交

		var array = getMousePosition( container, event.clientX, event.clientY );	// 处理做坐标
		onDoubleClickPosition.fromArray( array );	// 将坐标转化为 Vector2

		var intersects = getIntersects( onDoubleClickPosition, objects );	// 获得相交数组

		if ( intersects.length > 0 ) {

			var intersect = intersects[ 0 ];

			//signals.objectFocused.dispatch( intersect.object );
			show.select(intersect.object);		// 选中物体
			render();
		}

	}

	container.addEventListener( 'mousedown', onMouseDown, false );
	container.addEventListener( 'touchstart', onTouchStart, false );
	container.addEventListener( 'dblclick', onDoubleClick, false );
	
	signals.objectSelected.add(function ( object ) {			// 模型被选中时信号量

		//selectionBox.visible = false;
		transformControls.detach();

		if ( object !== null ) {
			// 这部分是用来处理选择框的
//			if ( object.geometry !== undefined &&
//				 object instanceof THREE.Sprite === false ) {
//
//				selectionBox.update( object );
//				selectionBox.visible = true;
//
//			}
			if(object.parent instanceof THREE.Group){
				
				transformControls.attach( object.parent );
				
			}else{
				transformControls.attach( object );
			}
				
			

		}	// if ( object !== null )


	});
	
	signals.objectAdded.add( function ( object ) {		// 添加了模型后把它加入到ray 判断数组中
		//console.log("执行了objectAdded信号量");
		object.traverse( function ( child ) {
			
			if(child instanceof THREE.Bone) return;
			//console.log("执行了objectAdded信号量",child);
			objects.push( child );

		} );

	} );
	
	signals.objectRemoved.add( function ( object ) {	// 移除了模型就把他从判断数组中移除

		object.traverse( function ( child ) {
			
			if(child instanceof THREE.Bone)	return;
			objects.splice( objects.indexOf( child ), 1 );

		} );

	} );
	
	signals.objectChanged.add( function ( object ) {	// 因为使用sidebar更改位置信息时，会偶尔出现helper没有跟上物体的情况

		if ( show.selected === object ) {		// 先判断是否是选择的物体

			//selectionBox.update( object );
			transformControls.update();

		}

//		if ( object instanceof THREE.PerspectiveCamera ) {
//
//			object.updateProjectionMatrix();
//
//		}

		render();

	} );
	
	function render() {

		transformControls.updateMatrixWorld();
		scene.updateMatrixWorld();

	}

};