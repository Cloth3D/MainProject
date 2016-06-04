/**
 * @author Chaoqun
 * @function 用来给选择的object更换材质
 */
var MaterialTool = function(show)
{
	this.object = null;				// 当前选中的物体

};

MaterialTool.prototype = {
	changeMap:function(str_type, url_newMap)
	{

	},				// changeMap:funciton()

	changeSelect:function(object)
	{
			this.object = object;
	}					// changeSelect:function(object)
};
