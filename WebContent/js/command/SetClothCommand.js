/**
 * @author Chao Qun
 * 功能：穿衣服操作的历史纪录恢复
 */


var SetClothCommand = function(human, type, url_cloth, url_diffuse, url_specular, url_normal, url_Opacity, url_light, url_human_alpha)
/**
* 采用不同步的方式加载贴图和模型
* 参数说明:
* hu: 此类在全局中的名称
* type: 字符串，为衣服类型 "upcloth", "trousers" , "glasses", "shoes", "hair"
* url_cloth: 衣服路径
* url_diffuse: diffuse贴图路径
* url_specular: specular贴图的路径
* url_normal: normal贴图路径
* url_Opacity: alpha贴图路径
* url_light: light贴图路径
* url_human_alpha:	用来与人体的贴图合并，形成新的透明贴图
*/
{
  Command.call( this );

	this.type = 'SetClothCommand';

	this.human = human;
  this.oldCloth = human[type];                  // 原有的衣服的模型
  this.oldAlphaMap = human.clothAlpha[type];    // 原有的衣服透明贴图
  this.oldHumanAlpha = human.material.alphaMap; // 原有的人体透明贴图

  this.url_cloth = url_cloth;
  this.url_diffuse = url_diffuse;
  this.url_specular = url_specular;
  this.url_normal = url_normal;
  this.url_Opacity = url_Opacity;
  this.url_light = url_light;
  this.url_human_alpha = url_human_alpha;

  this.cloth = null;                            // 新增的衣服模型
  this.ctype = type;                            // 类型
  this.human_alpha = null;                      // 衣服携带的透明贴图
  this.newHumanAlpha = null;     // 即将合成的新的人体透明贴图

};

SetClothCommand.prototype = {

  execute:function()                        // 执行
  {
    var human = this.human;
    if(this.cloth == null){
    	this.load(this);        // 如果是直接执行
    	
    }
    else {                    // 如果是恢复操作

      human.clothAlpha[this.ctype] = this.human_alpha;
      human.mergeAlpha_0815(human);						// 使用旧版的合成贴图函数
      
      human[this.ctype] = this.cloth;
      human.show.signals.objectAdded.dispatch(this.cloth);
      
      if(this.oldCloth !== null){
    	  human.group.remove(this.oldCloth);
    	  
    	  human.show.signals.objectRemoved.dispatch(this.oldCloth);
      }
      
      human.group.add(this.cloth);
    }
    
    //console.log(human);

  },    // execute:function()

  load:function(cmd)
  /**
  * 采用不同步的方式加载贴图和模型
  * 参数说明:
  * hu: 此类在全局中的名称
  * type: 字符串，为衣服类型 "upcloth", "trousers" , "glasses", "shoes", "hair"
  * url_cloth: 衣服路径
  * url_diffuse: diffuse贴图路径
  * url_specular: specular贴图的路径
  * url_normal: normal贴图路径
  * url_Opacity: alpha贴图路径
  * url_light: light贴图路径
  * url_human_alpha:	用来与人体的贴图合并，形成新的透明贴图
  */
  {
    var hu = cmd.human;

    var mater = new THREE.MeshPhongMaterial({		// 测试不同步加载的显示效果
      specular:0xffffff,
      skinning:true,
      alphaTest:0.5
    });

    var diffuse = new THREE.Texture();	// 读取diffuse贴图
    var specular = new THREE.Texture();		// 读取specular贴图
    var normal = new THREE.Texture();			// 读取normal贴图
    var opacity = new THREE.Texture();		// 读取opacity贴图
    var light = new THREE.Texture();			// 读取光照贴图

    var human_alpha = new THREE.Texture();		// 用来存放新加载的透明贴图
    
    var diffuse_ready 		= false;		// diffuse贴图是否加载完成的标志
    var specular_ready 		= false;		// specular贴图事发后加载完成的标志
    var normal_ready 		= false;		// normal贴图是否加载完成的标志
    var opacity_ready 		= false;		// opacity贴图是否加载完成的标志
    var light_ready 		= false;		// light贴图是否加载完成的
    var human_alpha_ready 	= false;		// 用来存放新加载的透明贴图 

    var loader1 = new THREE.ImageLoader();		// 读取diffuse
    var loader2 = new THREE.ImageLoader();		// 读取specular
    var loader3 = new THREE.ImageLoader();		// 读取normal
    var loader4 = new THREE.ImageLoader();		// 读取opacity
    var loader5 = new THREE.ImageLoader();		// 读取light贴图
    var loader6 = new THREE.ImageLoader();		// 读取人体的透明贴图
    

    var onProgress = function ( xhr ) {		// 用来调试读取进度
      if ( xhr.lengthComputable ) {
          var percentComplete = xhr.loaded / xhr.total * 100;
          console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) {		// 读取错误时执行
      console.log("图片加载错误");
    };

    var addCloth = function(hu, type, cloth){

      switch(type)     // 分成几类模型问题讨论
      {
        case 'upcloth':
        if(hu.upcloth != null){	
        	hu.show.signals.objectRemoved.dispatch(hu.upcloth);
        	hu.group.remove(hu.upcloth);
        }
        hu.upcloth = cloth;
        console.log('添加上衣');
        break;

        case 'trousers':
        if(hu.trousers != null){
        	hu.show.signals.objectRemoved.dispatch(hu.trousers);
        	hu.group.remove(hu.trousers);
        }
        hu.trousers = cloth;
        console.log('添加裤子');
        break;

        case 'glasses':
        if(hu.glasses != null){
        	hu.show.signals.objectRemoved.dispatch(hu.glasses);
        	hu.group.remove(hu.glasses);
        }
        hu.glasses = cloth;
        console.log('添加眼镜');
        break;

        case 'shoes':
        if(hu.shoes != null){
        	hu.show.signals.objectRemoved.dispatch(hu.shoes);
        	hu.group.remove(hu.shoes);
        }
        hu.shoes = cloth;
        console.log('添加鞋子');
        break;

        case 'hair':
        if(hu.hair != null){
        	hu.show.signals.objectRemoved.dispatch(hu.hair);
        	hu.group.remove(hu.hair);
        }
        hu.hair = cloth;
        console.log('添加头发');
        break;

        default:
        console.log("未有匹配项");
      };
      hu.show.signals.objectAdded.dispatch(cloth);

    };
    var newHumanAlpha = undefined;
    var editAlphaMap = function(hu, human_alpha, type)												// 因为异步加载的关系，必须等到透明贴图加载完成后再调用这个函数
    {
      switch(type)     // 分成几类模型问题讨论
      {
        case 'upcloth':
        hu.clothAlpha["upcloth"]	=	human_alpha;				 // 将透明贴图保存
        newHumanAlpha = hu.mergeAlpha(hu);																// 调用合并贴图函数
        console.log('合成上衣贴图');
        break;

        case 'trousers':
        hu.clothAlpha['trousers'] = human_alpha;				  // 将透明贴图保存
        newHumanAlpha = hu.mergeAlpha(hu);																// 调用合并贴图函数
        console.log('合成裤子贴图');
        break;

        case 'shoes':
        hu.clothAlpha['shoes'] = human_alpha;							  // 将透明贴图保存
        newHumanAlpha = hu.mergeAlpha(hu);																	// 调用合并贴图函数
        console.log('添加鞋子');
        break;

        default:
        newHumanAlpha = hu.mergeAlpha(hu);
        console.log("未有匹配项");
      };
      cmd.newHumanAlpha = newHumanAlpha;
    };

    loader1.load( cmd.url_diffuse, function ( image ) {		// 读取diffuse贴图

        diffuse.image = image;
        diffuse.needsUpdate = true;

        mater.map = diffuse;					// 将贴图加载在材质上
        mater.needsUpdate = true;
        
        diffuse_ready = true;					// 贴图已经加载完成标志
        // 判断几个贴图是否都已加载完全
        if(diffuse_ready && specular_ready && normal_ready && 
        		opacity_ready && light_ready && human_alpha_ready && cloth !== undefined)
        {
        	cloth.visible = true;
          	hu.material.alphaMap = newHumanAlpha;				// 合成后的贴图附加在human材质上
      		hu.material.needsUpdate = true;
        }


    } ,onProgress,onError);			// load diffuse

    loader2.load( cmd.url_specular, function ( image ) {		// 读取specular贴图

        specular.image = image;
        specular.needsUpdate = true;
        mater.specularMap = specular;
        mater.needsUpdate = true;
        
        specular_ready = true;
        // 判断几个贴图是否都已加载完全
        if(diffuse_ready && specular_ready && normal_ready && 
        		opacity_ready && light_ready && human_alpha_ready && cloth !== undefined)
        {
        	cloth.visible = true;
          	hu.material.alphaMap = newHumanAlpha;				// 合成后的贴图附加在human材质上
      		hu.material.needsUpdate = true;
        }
        

    } ,onProgress,onError);			// load specular

    loader3.load( cmd.url_normal, function ( image ) {		// 读取normal贴图

        normal.image = image;
        normal.needsUpdate = true;
        mater.normalMap = normal;
        mater.needsUpdate = true;

        normal_ready = true;			// 加载完成
        // 判断几个贴图是否都已加载完全
        if(diffuse_ready && specular_ready && normal_ready && 
        		opacity_ready && light_ready && human_alpha_ready && cloth !== undefined)
        {
        	cloth.visible = true;
          	hu.material.alphaMap = newHumanAlpha;				// 合成后的贴图附加在human材质上
      		hu.material.needsUpdate = true;
        }

    } ,onProgress,onError);			// load normal

    loader4.load( cmd.url_Opacity, function ( image ) {		// 读取opacity贴图

        opacity.image = image;
        opacity.needsUpdate = true;
        mater.alphaMap = opacity;
        mater.needsUpdate = true;

        opacity_ready = true;
        // 判断几个贴图是否都已加载完全
        if(diffuse_ready && specular_ready && normal_ready && 
        		opacity_ready && light_ready && human_alpha_ready && cloth !== undefined)
        {
        	cloth.visible = true;
          	hu.material.alphaMap = newHumanAlpha;				// 合成后的贴图附加在human材质上
      		hu.material.needsUpdate = true;
        }

    } ,onProgress,onError);			// load opacity

    if(cmd.url_light !== undefined)								// 有考虑不加光照贴图
    {
    	loader5.load( cmd.url_light, function ( image ) {		// 读取light贴图

            light.image = image;
            light.needsUpdate = true;
            mater.lightMap = light;
            
            mater.lightMapIntensity = 0.5;			// 光照贴图的强度
            mater.shininess = 10;					// 反光的强度
            mater.normalScale = new THREE.Vector2(0.7, 0.7);	// 凹凸贴图的强度，数值越小，强度越大
            mater.needsUpdate = true;
            
            light_ready = true;
            // 判断几个贴图是否都已加载完全
            if(diffuse_ready && specular_ready && normal_ready && 
            		opacity_ready && light_ready && human_alpha_ready && cloth !== undefined)
            {
            	cloth.visible = true;
              	hu.material.alphaMap = newHumanAlpha;				// 合成后的贴图附加在human材质上
          		hu.material.needsUpdate = true;
            }
            //console.log("light贴图加载完成");

        } ,onProgress,onError);			// load light
    }
    else							// 万一不加光照贴图的话，就默认关照贴图已经加载完成
    {
    	light_ready = true;
    }
    
    if(cmd.url_human_alpha !== undefined)					// 头发和眼镜是没加透明贴图的
    {
    	loader6.load( cmd.url_human_alpha, function ( image ) {		// 读取human_alpha贴图

            human_alpha.image = image;
            human_alpha.needsUpdate = true;

            cmd.human_alpha = human_alpha;                    // 给cmd保存透明贴图记录
            
            editAlphaMap(cmd.human, human_alpha, cmd.ctype);	// 贴图加载完成，开始合成贴图
            
            human_alpha_ready = true;					// 同时贴图合成完成
            // 判断几个贴图是否都已加载完全
            if(diffuse_ready && specular_ready && normal_ready && 
            		opacity_ready && light_ready && human_alpha_ready && cloth !== undefined)
            {
            	cloth.visible = true;
              	hu.material.alphaMap = newHumanAlpha;				// 合成后的贴图附加在human材质上
          		hu.material.needsUpdate = true;
            }

        } ,onProgress,onError);			// load normal
    }
    else			// 如果不需要加载透明贴图则直接算贴图加载完成
    {
    	human_alpha_ready = true;
    }
    

    var jsonloader = new THREE.JSONLoader();
    var cloth = null;
    jsonloader.load( cmd.url_cloth, function ( geometry, materials ) {				// 加载衣服模型，使用上面加载的衣服

      cloth = new THREE.SkinnedMesh(geometry, mater);		//	新建衣服模型
      cloth.bind(hu.human.skeleton, cloth.matrixWorld);			// 将人体模型的骨架绑定在衣服上

      cmd.cloth = cloth;                                    // 将记录保存在cmd里
      
      cloth.visible =false;									// 初始时衣服不显示
      
      // 判断几个贴图是否都已加载完全
      if(diffuse_ready && specular_ready && normal_ready && 
      		opacity_ready && light_ready && human_alpha_ready && cloth !== undefined)
      {
      	cloth.visible = true;
      	hu.material.alphaMap = newHumanAlpha;				// 合成后的贴图附加在human材质上
  		hu.material.needsUpdate = true;
      }
      
      hu.group.add(cloth);
      addCloth(hu, cmd.ctype, cloth);

      console.log("添加了衣服模型");

    },onProgress,onError);						// load cloth

  },				// loadCloth:function(hu, type, url_cloth, url_diffuse, url_specular, url_normal, url_Opacity, url_light)

  undo:function()                           // 撤销
  {
      var human = this.human;

      // 移除新衣服
      human.group.remove(this.cloth);
      human.show.signals.objectRemoved.dispatch(this.cloth);
      // 清空衣服引用
      human.clothAlpha[this.ctype] = undefined;
      human[this.ctype] = undefined;
      //  如果需要的话，穿上旧衣服，加上衣服引用
      if(this.oldCloth)
        {
          human.group.add(this.oldCloth);
          human[this.ctype] = this.oldCloth;
          human.clothAlpha[this.ctype] = this.oldAlphaMap;
          human.show.signals.objectAdded.dispatch(this.oldCloth);
        }
      human.mergeAlpha_0815(human);					// 此处使用的仍是旧版的合成贴图函数
      
  }

};
