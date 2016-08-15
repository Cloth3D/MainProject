/**
 * @author Chaoqun 此文件目的将对xml的分析过程集合在一起
 */

//var xmlDoc = checkXMLDocObj('model_path.xml');		// 读取xml文档
//console.log(xmlDoc);
//
//var strTest = getModelURL(xmlDoc, 'cloth1', 'bottom');	// 获得某件衣服模型
//console.log(strTest);
//var strTest2 = getModelOpacityURL(xmlDoc, 'cloth1', 'bottom');
//console.log(strTest2);
//
//var mapTest = getMatURL(xmlDoc, 'cloth2');			// 获得衣服贴图
//console.log(mapTest);

var loadXML = function(xmlFile) {
	var xmlDoc;
	try // Internet Explorer
	{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false;
		xmlDoc.load(xmlFile);
	} catch (e) {
		try // Firefox, Mozilla, Opera, etc.
		{
			xmlDoc = document.implementation.createDocument("", "", null);
			xmlDoc.async = false;
			xmlDoc.load(xmlFile);
		} catch (e) {
			try // Google Chrome
			{
				var xmlhttp = new window.XMLHttpRequest();
				xmlhttp.open("GET", xmlFile, false);
				xmlhttp.send(null);
				xmlDoc = xmlhttp.responseXML.documentElement;
			} catch (e) {
				error = e.message;
			}
		}
	}
	return xmlDoc;
}

var checkXMLDocObj = function(xmlFile) {
	var xmlDoc = loadXML(xmlFile);
	if (xmlDoc == null) {
		alert('您的浏览器不支持xml文件读取,于是本页面禁止您的操作,推荐使用chrome浏览器可以解决此问题!');
		window.location.href = '/Index.aspx';
	}
	return xmlDoc;
}

function getModelURL(xmlDoc, cloth_id, cloth_type)
/**
* xmlDoc:xmlDocumention
* cloth_id:字符串与xml中的服装节点相同<cloth1>……</cloth1>
* cloth_type:字符串衣服类型，可选 'top', 'bottom', 'hair', 'eyewear', 'shoes'
* return : 字符串，该模型的url
*/
{
	var clothArray = xmlDoc.getElementsByTagName(cloth_id)[0];		// 找到衣服组的标签
	clothArray = clothArray.children;								// cloth子节点
	var type;
	
	for(var i = 0; i < clothArray.length; i++)
	{
		if(clothArray[i].nodeName == cloth_type)
		{
			type = clothArray[i];				// 找到那个衣服的标签
			break;
		}
	}
	if(type == undefined) return null;			// 如果没有寻找到
	console.log(type);
	var typeArray = type.children;			// 再寻找data标签得到服装
	for(var i = 0; i < typeArray.length; i++)
	{
		if(typeArray[i].nodeName == 'data')
			return typeArray[i].textContent;
	}
	return null;
}


function getMatURL(xmlDoc, cloth_id)
/**
* xmlDoc:xmlDocumention
* cloth_id:字符串与xml中的服装节点相同<cloth1>……</cloth1>
* return:{
*			diffuse: string,
*			specular: string,
*   		normal: string,
*           opacity: string,
* 			lighting: string
* }
*/
{
	var clothArray = xmlDoc.getElementsByTagName(cloth_id)[0];		// 找到衣服组的标签
	clothArray = clothArray.children;								// cloth子节点
	var map;
	for(var i = 0; i < clothArray.length; i++)
	{
		if(clothArray[i].nodeName == 'map')			// 找到map节点
		{
			map = clothArray[i];
			break;
		}
	}
	
	if(map != undefined)							// 没找到要返回null
	{
		var value = new Object();
		var mapArray = map.children;
		for(var i = 0; i < mapArray.length; i++)
		{
			value[mapArray[i].nodeName] = mapArray[i].textContent;
		}
		return value;
	}
	else return null;
}

function getModelOpacityURL(xmlDoc, cloth_id, cloth_type)
/**
* xmlDoc:xmlDocumention
* cloth_id:字符串与xml中的服装节点相同<cloth1>……</cloth1>
* cloth_type:字符串衣服类型，可选 'top', 'bottom', 'hair', 'eyewear', 'shoes'
* return : 字符串，该模型的透明贴图的url
*/
{
	var clothArray = xmlDoc.getElementsByTagName(cloth_id)[0];		// 找到衣服组的标签
	clothArray = clothArray.children;								// cloth子节点
	var type;
	
	for(var i = 0; i < clothArray.length; i++)
	{
		if(clothArray[i].nodeName == cloth_type)
		{
			type = clothArray[i];				// 找到那个衣服的标签
			break;
		}
	}
	if(type == undefined) return null;			// 如果没有寻找到
	console.log(type);
	var typeArray = type.children;			// 再寻找data标签得到服装
	for(var i = 0; i < typeArray.length; i++)
	{
		if(typeArray[i].nodeName == 'opacity')
			return typeArray[i].textContent;
	}
	return null;
}