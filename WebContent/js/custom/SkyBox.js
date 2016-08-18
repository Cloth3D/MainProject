/**
 * xmlDoc:xmlDocumention
 * skybox_id:字符串，与xml中的<skybox_id>节点一致
 * show:将加载的skybox加载到show.scene中
 */
function addSkyBox(xmlDoc, skybox_id, show)
{
	if(xmlDoc == undefined || skybox_id == undefined || show == undefined) return;		// 如果参数信息不够
	var skyboxArray = xmlDoc.getElementsByTagName(skybox_id)[0];		// 先找到对应的skybox节点
	
	if(skyboxArray == undefined)	return;
	skyboxArray = skyboxArray.children;									// 再访问下面的子节点
	
	var skyMap = [];
	for(var i = 0; i < skyboxArray.length; i++){
		
		skyMap.push( skyboxArray[i].textContent);
	}
	
	// 获得了六张贴图的地址
	var scene = show.scene;
	
	function makeSkybox( urls, size ) {
		var skyboxCubemap = new THREE.CubeTextureLoader().load( urls, function(){		// onload:防止出现图片没加载完成时的黑屏
			skyboxCubemap.format = THREE.RGBFormat;
			
			var skyboxShader = THREE.ShaderLib['cube'];
			skyboxShader.uniforms['tCube'].value = skyboxCubemap;
			
			scene.add(new THREE.Mesh(
			new THREE.BoxGeometry( size, size, size ),
			new THREE.ShaderMaterial({
				fragmentShader : skyboxShader.fragmentShader, 
				vertexShader : skyboxShader.vertexShader,
				uniforms : skyboxShader.uniforms, 
				depthWrite : false, 
				side : THREE.BackSide
			})
		));
			console.log('添加了天空盒子', skybox_id);
			
		} );

	}
	
	
	var skybox = makeSkybox( skyMap, 4000 );
	
	
}

//function addSkyBox(xmlDoc, skybox_id, show)
//{
//	if(xmlDoc == undefined || skybox_id == undefined || show == undefined) return;		// 如果参数信息不够
//	var skyboxArray = xmlDoc.getElementsByTagName(skybox_id)[0];		// 先找到对应的skybox节点
//	
//	if(skyboxArray == undefined)	return;
//	skyboxArray = skyboxArray.children;									// 再访问下面的子节点
//	
//	var skyMap = [];
//	for(var i = 0; i < skyboxArray.length; i++){
//		
//		skyMap.push( skyboxArray[i].textContent);
//	}
//	console.log(skyMap);
//	
//	// 获得了六张贴图的地址
//	
//	
//	function makeSkybox( urls, size ) {
//		var skyboxCubemap = new THREE.CubeTextureLoader().load( urls );
//		skyboxCubemap.format = THREE.RGBFormat;
//
//		var skyboxShader = THREE.ShaderLib['cube'];
//		skyboxShader.uniforms['tCube'].value = skyboxCubemap;
//		console.log('执行了添加天空盒子语句');
//		
//		return new THREE.Mesh(
//			new THREE.BoxGeometry( size, size, size ),
//			new THREE.ShaderMaterial({
//				fragmentShader : skyboxShader.fragmentShader, 
//				vertexShader : skyboxShader.vertexShader,
//				uniforms : skyboxShader.uniforms, 
//				depthWrite : false, 
//				side : THREE.BackSide
//			})
//		);
//	}
//	
//	var scene = show.scene;
//	var skybox = makeSkybox( skyMap, 4000 );
//	scene.add(skybox);
//	
//}