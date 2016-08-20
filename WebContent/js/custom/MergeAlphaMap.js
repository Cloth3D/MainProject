/**
 *  @author Chao Qun
 * 目的：用来合并两张透明贴图，使新合成的贴图，透明的地方为两张图的叠加。
 * 方法：借助canvas进行操作
 * 时间： 2016/6/5
 */
 var  MergeAlphaMap = function()
 {
   this.merge_1024 = function(tex1, tex2)
   /**
    * parameters
    * tex1 : THREE.Texture
    * tex2 : THREE.Texture
    * return
    * texture: THREE.Texture
    * 思路，遍历
    */
   {
     var cs = document.createElement('canvas');
     cs.width = 1024;
     cs.height = 1024;

     var ctx = cs.getContext("2d");

     ctx.drawImage(tex1.image, 0, 0);   // 将图片1放在canvas上
     var img1 = ctx.getImageData(0, 0,
       cs.width, cs.height);    // 转化为ImageData

     ctx.drawImage(tex2.image, 0, 0);   // 将图片2放在canvas
     var img2 = ctx.getImageData(0, 0,
       cs.width, cs.height);    // 转化为ImageData

     var tex = ctx.createImageData(1024, 1024);     // 新建一个新的ImageData

     var length = tex.data.length;        // 图片的数组的长度
     var value_x = 512;                  // 有效区域的宽度
     var value_y = 512;                  // 有效区域的高度
     var pixel = 0;                     // 用来代指当前像素

     for(var i = 0; i < value_y ; i++)
     {
       for(var j = 0 ; j < value_x; j++)
       {

         if(img1.data[pixel + 0] == 0 || img2.data[pixel + 0] == 0)     // 因为黑色部分RGB必定全部为0
         {
           tex.data[pixel + 0] = 0;       // R 红
           tex.data[pixel + 1] = 0;       // G 绿
           tex.data[pixel + 2] = 0;       // B 蓝
           tex.data[pixel + 3] = 255;       // A 透明
         }        // if
         else {     // 其余部分颜色取两图平均值
           tex.data[pixel + 0] = (img1.data[pixel + 0] + img2.data[pixel + 0]) / 2;       // R 红
           tex.data[pixel + 1] = (img1.data[pixel + 1] + img2.data[pixel + 1]) / 2;       // G 绿
           tex.data[pixel + 2] = (img1.data[pixel + 2] + img2.data[pixel + 2]) / 2;       // B 蓝
           tex.data[pixel + 3] = 255;       // A 透明
         }    // else

         pixel += 4;    // 向后跳一个像素
       }
       pixel += 4 * (tex.width - value_x) ;  // 跳过无用的半行
     }  // for(var i = 0; i < value_y ; i++)

     ctx.putImageData(tex, 0, 0);       // 将图片放入canvas
    //  var image = new Image();
    //  image.src = canvas.toDataURL("image/png");
     var image = document.createElement( 'img' );     // 将图片保存为THREE.Texture可以使用的格式
     image.src = cs.toDataURL("image/png");

     var texture = new THREE.Texture();               // 新建一个THREE.Texture类型
     texture.image = image;
     texture.needsUpdate = true;

     return texture;                                  // 返回texture 可以直接替换材质中的贴图
   }

 };
