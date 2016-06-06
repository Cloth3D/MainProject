/**
 *  @author Chao Qun
 * 目的：用来合并两张透明贴图，使新合成的贴图，透明的地方为两张图的叠加。
 * 方法：借助canvas进行操作
 */
 var  MergeAlphaMap = function()
 {
   this.cs = document.createElement('canvas');
   this.cs.className = "tempCanvas";
   this.cs.width = 2048;
   this.cs.height = 2048;
   this.cs.zIndex = 8;

   this.merge = function(tex1, tex2)
   /**
    * parameters
    * tex1 : THREE.Texture
    * tex2 : THREE.Texture
    * return
    * texture: THREE.Texture
    */
   {
     var cs = document.createElement('canvas');
     cs.width = 2048;
     cs.height = 2048;

     var ctx = cs.getContext("2d");

     ctx.drawImage(tex1.image, 0, 0);   // 将图片1放在canvas上
     var img1 = ctx.getImageData(0, 0,
       cs.width, cs.height);    // 转化为ImageData

     ctx.drawImage(tex2.image, 0, 0);   // 将图片2放在canvas
     var img2 = ctx.getImageData(0, 0,
       cs.width, cs.height);    // 转化为ImageData

     var tex = ctx.createImageData(2048, 2048);     // 新建一个新的ImageData

     for(var i = 0; i < tex.data.length; i = i + 4)     // 求并的关键操作
     {
        if(img1.data[i + 3] == 0 )  // 如果该点是透明
        {
          tex.data[i + 0] = 0;       // R 红
          tex.data[i + 1] = 0;       // G 绿
          tex.data[i + 2] = 0;       // B 蓝
          tex.data[i + 3] = 0;       // A 透明

          continue;
        }

       if(img1.data[i + 0] == 0 || img2.data[i + 0] == 0)     // 因为黑色部分RGB必定全部为0
       {
         tex.data[i + 0] = 0;       // R 红
         tex.data[i + 1] = 0;       // G 绿
         tex.data[i + 2] = 0;       // B 蓝
         tex.data[i + 3] = 255;       // A 透明

         continue;
       }
       else {     // 其余部分颜色取两图平均值
         tex.data[i + 0] = (img1.data[i + 0] + img2.data[i + 0]) / 2;       // R 红
         tex.data[i + 1] = (img1.data[i + 1] + img2.data[i + 1]) / 2;       // G 绿
         tex.data[i + 2] = (img1.data[i + 2] + img2.data[i + 2]) / 2;       // B 蓝
         tex.data[i + 3] = 255;       // A 透明

         continue;
       }

     }      // for(var i = 0; i < tex.data.length; i += 4)

     ctx.putImageData(tex, 0, 0);       // 将图片放入canvas
    //  var image = new Image();
    //  image.src = canvas.toDataURL("image/png");
     var image = document.createElement( 'img' );     // 将图片保存为THREE.Texture可以使用的格式
     image.src = cs.toDataURL("image/png");

     var texture = new THREE.Texture();               // 新建一个THREE.Texture类型
     texture.image = image;
     texture.needsUpdate = true;

     return texture;                                  // 返回texture 可以直接替换材质中的贴图
   };
 };
