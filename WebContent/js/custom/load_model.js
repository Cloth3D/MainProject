/**
 * @author 江超群
 * 专门用来读取我们自己的人体模型
 */

var LoadAModel = function(show)
{
	this.materials = [];
	this.model = [];
	this.Group = new THREE.Group();
	this.loader =new THREE.JSONLoader();

};

LoadAModel.prototype = {
	load:function(url_body, url_eye )	// 从外部调用这个函数
	{

	},

	loadMaterial:function(url)
	{

	},

	loadSkinnedMesh:function(url)
	{
		var skinnedMesh = null;
		loader.load( url, function ( geometry, materials ) {

					for ( var k in materials ) {

						materials[k].skinning = true;

					}

					skinnedMesh = new THREE.SkinnedMesh(geometry, new THREE.MultiMaterial(materials));
					skinnedMesh.scale.set( 1, 1, 1 );
					scene.add( skinnedMesh );

					mixer = new THREE.AnimationMixer( skinnedMesh );
					mixer.clipAction( skinnedMesh.geometry.animations[ 0 ] ).play();

				});
				return skinnedMesh;
	}


}
