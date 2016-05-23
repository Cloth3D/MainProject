/**
 * @author 江超群
 * 专门用来读取我们自己的人体模型
 */

var Human = function(show)
{
	this.material = null;						// 存放人体贴图

	this.mixer = null;							// 用来播放动画

	this.human = null;							// body
	this.eyes = null;								// 眼球和人体是分开的
	this.upcloth = null;						// 上衣
	this.trousers = null;						// 裤子
	this.glasses = null;						// 眼镜
	this.shoes = null;							// 鞋

	this.skeletonhelper = null;			// 骨架显示

};

Human.prototype = {
	load:function(url_body, url_eye, url_diffuse, url_specular)	// 从外部调用这个函数
	{
	},

	loadMaterial:function(url_diffuse, url_specular)
	{
	},

	loadSkinnedMesh:function(url_body, url_diffuse, url_specular)
	/**
	*	保证模型加载完成后在加载贴图。
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

		loader.load( url_body, function ( geometry, materials ) {				// 加载模型,模型加载完成后加载贴图

			var diffuse = new THREE.Texture();	// 读取diffuse贴图
			var specular = new THREE.Texture();		// 读取normal贴图



			var loader = new THREE.ImageLoader();			// 新建用来读取图片
			var loader2 = new THREE.ImageLoader();		// 读取第二张图片

			loader.load( url_diffuse, function ( image ) {		// 读取diffuse贴图

				diffuse.image = image;
				diffuse.needsUpdate = true;
				console.log("diffuse加载完成");

				loader2.load( url_specular, function ( image ) {		// 读取normal贴图

						specular.image = image;
						specular.needsUpdate = true;
						console.log("specular加载完成");

						// for(var i = 0; i < materials.length; i++)
						// {
						// 	var m = materials[i];
						// 	m.skinning = true;
						// 	m.map = diffuse;
						// 	m.specularMap = specular;
						// 	m.transparent = false;
						// }

						this.material = new THREE.MeshLambertMaterial({				// 此处两张图片都加载完成

							color:0xffffff,
							map:diffuse,
							specularMap:specular,
							shading:THREE.SmoothShading,
							skinning:true

						});


						skinnedMesh = new THREE.SkinnedMesh(geometry,this.material);
						skinnedMesh.scale.set( 1, 1, 1 );
						show.addObject( skinnedMesh );					// 添加到场景中
						this.body = skinnedMesh;

						//mixer = new THREE.AnimationMixer( skinnedMesh );
						//mixer.clipAction( skinnedMesh.geometry.animations[ 0 ] ).play();

					} ,onProgress,onError);

			} ,onProgress,onError);


				},onProgress,onError);
	}


}
