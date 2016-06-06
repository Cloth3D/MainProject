/**
 * @author Chao Qun
 * 此文件目的是为了防止几个材质使用了同一张贴图，而导致贴图重复加载的情况
 * --------------------------------------
 * 否决，经检查，THREE.js内部已经考虑到了重复加载问题，不需要这个新的加载管理
 * --------------------------------------
 * 创建日期:2016年6月4日
 */

 /**
 * show.image = {};
 * var key1 = '动态key1';
 * var key2 = '动态key2';
 * var map = {};
 * map[key1] = 1;
 * map[key2] = 2;
 *
 * console.log(map[key1]);//结果是1.
 * console.log(map[key2]);//结果是2.
 *
 * //如果遍历map
 * for(var prop in map){
 *    if(map.hasOwnProperty(prop)){
 *      console.log('key is ' + prop +' and value is' + map[prop]);
 *    }
 *  }
 */
var ImageMange = function(show)
{
  this.texture = new THREE.Texture();
  this.load = function( url, onLoad, onProgress, onError )
  {
    for(var i = 0; i < show.image.length; i++)
    {

    }

  };
};
