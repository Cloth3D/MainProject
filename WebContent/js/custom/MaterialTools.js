/**
 * @author Chaoqun
 * @function 用来给选择的object更换材质
 */
var MaterialTool = function(show)
{
	this.object = null;				// 当前选中的物体

};

MaterialTool.prototype = {
	changeMap:function(mt, str_type, url_newMap)
	{
		var texture = new THREE.Texture();						// 储存图片
		var loader = new THREE.ImageLoader();			// 加载图片

		var onProgress = function ( xhr ) {		// 用来调试读取进度
			if ( xhr.lengthComputable ) {
					var percentComplete = xhr.loaded / xhr.total * 100;
					console.log( Math.round(percentComplete, 2) + '% downloaded' );
				}
		};

		var onError = function ( xhr ) {		// 读取错误时执行
			console.log("图片加载错误");
		};


		var change = function(mt, str_type, texture)
		{
			switch(str_type)
			{
				case "map":							// 纹理贴图
					mt.object.material.map = texture;
				break;

				case "specularMap":			// 反射贴图
					mt.object.material.specularMap = texture;
				break;

				case "normalMap":				// 法相贴图
					mt.object.material.normalMap = texture;
				break;

				case "alphaMap":				// 透明贴图
					mt.object.material.alphaMap = texture;
				break;

				case "lightMap":				// 光照贴图
					mt.object.material.lightMap = texture;
				break;

				default:console.log("不支持当前贴图更换");

			};
			mt.object.material.needsUpdate = true;
		};

		loader.load(url_newMap, function(image){

			texture.image = image;
			texture.needsUpdate = true;

			change(mt, str_type, texture);		// 调用函数更换贴图

		}, onProgress, onError);			// load newMap


	},				// changeMap:funciton()

	changeSelect:function(object)
	{
			this.object = object;
	}					// changeSelect:function(object)

	
};
