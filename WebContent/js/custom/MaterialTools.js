/**
 * @author Chaoqun
 * @function 用来给选择的object更换材质
 */
var MaterialTool = function(show)
{

};
MaterialTool.prototype = {

	addMeshLambertMaterial:function(object, url_diffuse, url_specular )
	{
			var temp = show.mesh[object.uuid];

			var diffuse = new THREE.Texture();	// 读取diffuse贴图
			var specular = new THREE.Texture();		// 读取normal贴图

    	var onProgress = function ( xhr ) {		// 用来调试读取进度
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        	}
    	};
    	var onError = function ( xhr ) {		// 读取错误时执行
				console.log("图片加载错误");
    	};

    	var loader = new THREE.ImageLoader();			// 新建用来读取图片
    	loader.load( url_diffuse, function ( image ) {		// 读取diffuse贴图

        diffuse.image = image;
        diffuse.needsUpdate = true;

    	} ,onProgress,onError);
    	console.log("diffuse加载完成");
		loader.load( url_specular, function ( image ) {		// 读取normal贴图

        specular.image = image;
        specular.needsUpdate = true;

    	} ,onProgress,onError);
		console.log("specular加载完成");

			var material_new = new THREE.MeshLambertMaterial({
				color:0xffffff,
				map:diffuse,
				specularMap:specular,
				shading:THREE.SmoothShading
			});

			temp.materials.push(material_new);		// 将material塞入

			for(var i = 0 ;i < object.children.length; i++)
			{
				object.children[i].material = material_new;
			}

	}
};
