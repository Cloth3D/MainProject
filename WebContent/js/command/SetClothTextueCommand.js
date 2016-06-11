/**
 * @author Chao Qun
 * 功能：更换衣服纹理贴图的CMD
 */


var SetClothTextureCommand = function( human, type, url_diffuse, url_specular, url_normal, url_Opacity, url_light )
/**
* 参数说明:
* human: 此类在全局中的名称
* type: 字符串，为衣服类型 "upcloth", "trousers" , "glasses", "shoes", "hair"
* url_diffuse: diffuse贴图路径
* url_specular: specular贴图的路径
* url_normal: normal贴图路径
* url_Opacity: alpha贴图路径
* url_light: light贴图路径
*/
{
  Command.call(this);
  this.type = 'SetClothTextureCommand';
  this.name = '';

  this.human        = human;                // 人体
  this.ClothType    = type;                 // ClothType:
  this.url_diffuse  = url_diffuse;          // 纹理贴图
  this.url_specular = url_specular;         // 反射贴图
  this.url_normal   = url_normal;           // 法向贴图
  this.url_Opacity  = url_Opacity;          // 透明贴图
  this.url_light    = url_light;            // 光照贴图

  this.OldDiffuse   = null;                 // 衣服上原有的纹理贴图
  this.OldSpecular  = null;                 // 衣服上原有的反射贴图
  this.OldNormal    = null;                 // 衣服上原有的法向贴图
  this.OldOpacity   = null;                 // 衣服上原有的透明贴图
  this.OldLight     = null;                 // 衣服上原有的光照贴图

  this.NewDiffuse   = null;                 // 即将加载的纹理贴图
  this.NewSpecular  = null;                 // 即将加载的反射贴图
  this.NewNormal    = null;                 // 即将加载的法向贴图
  this.NewOpacity   = null;                 // 即将加载的透明贴图
  this.NewLight     = null;                 // 即将加载的光照贴图

  if(human[type] != null)
  {
    var cloth = human[type];
    this.OldDiffuse   = cloth.material.map;           // 拷贝map
    this.OldSpecular  = cloth.material.specularMap;  // 拷贝反射贴图
    this.OldNormal    = cloth.material.normalMap;      // 拷贝法相贴图
    this.OldOpacity   = cloth.material.alphaMap;      // 拷贝透明贴图
    this.OldLight     = cloth.material.lightMap;        // 拷贝光照贴图
  }

};

SetClothTextureCommand.prototype =
{
    execute:function()
    {
      if(this.NewDiffuse == null)         // 如果没有加载贴图
        this.loadTexture(this);
      else {
        var cloth = this.human[this.ClothType];

        cloth.material.map          = this.NewDiffuse;
        cloth.material.specularMap  = this.NewSpecular;
        cloth.material.normalMap    = this.NewNormal;
        cloth.material.alphaMap     = this.NewOpacity;
        cloth.material.lightMap     = this.NewLight;
      }

    },

    undo:function()
    {
        if(this.OldDiffuse)                             // 撤销操作，如果有旧贴图，要换回去
        {
          cloth.material.map          = this.OldDiffuse;
          cloth.material.specularMap  = this.OldSpecular;
          cloth.material.normalMap    = this.OldNormal;
          cloth.material.alphaMap     = this.OldOpacity;
          cloth.material.lightMap     = this.OldLight;
        }
    },

    loadTexture(cmd)
    {
      var hu    = cmd.human;
      var cloth = cmd.human[cmd.ClothType];

      var diffuse   = new THREE.Texture();	    // 读取diffuse贴图
      var specular  = new THREE.Texture();		  // 读取specular贴图
      var normal    = new THREE.Texture();			// 读取normal贴图
      var opacity   = new THREE.Texture();		  // 读取opacity贴图
      var light     = new THREE.Texture();			// 读取光照贴图

      var loader1   = new THREE.ImageLoader();		// 读取diffuse
      var loader2   = new THREE.ImageLoader();		// 读取specular
      var loader3   = new THREE.ImageLoader();		// 读取normal
      var loader4   = new THREE.ImageLoader();		// 读取opacity
      var loader5   = new THREE.ImageLoader();		// 读取light贴图

      var onProgress = function ( xhr ) {		// 用来调试读取进度
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
          }
      };

      var onError = function ( xhr ) {		// 读取错误时执行
        console.log("图片加载错误");
      };

      loader1.load( cmd.url_diffuse, function ( image ) {		// 读取diffuse贴图

          diffuse.image       = image;              // 更新Texture的贴图
          diffuse.needsUpdate = true;
          cmd.NewDiffuse      = diffuse;           // 保存该Texture的纹理引用，用于恢复功能

          cloth.material.map         = diffuse;       // 将贴图直接贴在衣服上
          cloth.material.needsUpdate = true;


          console.log("diffuse贴图加载完成");

      } ,onProgress,onError);			// load diffuse

      loader2.load( cmd.url_specular, function ( image ) {		// 读取specular贴图

          specular.image        = image;
          specular.needsUpdate  = true;
          cmd.NewSpecular       = specular;

          cloth.material.specularMap = specular;
          cloth.material.needsUpdate = true;

          console.log("specular贴图加载完成");

      } ,onProgress,onError);			// load specular

      loader3.load( cmd.url_normal, function ( image ) {		// 读取normal贴图

          normal.image          = image;
          normal.needsUpdate    = true;
          cmd.NewNormal         = normal;

          cloth.material.normalMap    = normal;
          cloth.material.needsUpdate  = true;

          console.log("normal贴图加载完成");

      } ,onProgress,onError);			// load normal

      loader4.load( cmd.url_Opacity, function ( image ) {		// 读取opacity贴图

          opacity.image       = image;
          opacity.needsUpdate = true;
          cmd.NewOpacity      = opacity;

          cloth.material.alphaMap     = opacity;
          cloth.material.needsUpdate  = true;

          console.log("opacity贴图加载完成");

      } ,onProgress,onError);			// load opacity

      loader5.load( cmd.url_light, function ( image ) {		// 读取light贴图

          light.image       = image;
          light.needsUpdate = true;
          cmd.NewLight      = light;

          cloth.material.lightMap     = light;
          cloth.material.needsUpdate  = true;

          console.log("light贴图加载完成");

      } ,onProgress,onError);			// load light

    }
}
