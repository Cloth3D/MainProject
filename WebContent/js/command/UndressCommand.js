/**
 * @author Chao Qun
 * 功能：用来脱衣服的CMD
 */

var UndressCommand = function(human, type)
/**
 * 采用不同步的方式加载贴图和模型
 * 参数说明:
 * hu: 此类在全局中的名称
 * type: 字符串，为衣服类型 "upcloth", "trousers" , "glasses", "shoes", "hair"
 */
{
	Command.call(this);

	//this.type = 'UndressCommand';
	
	this.updatable = true;							// 防止多次误击
	this.human = human;								// 留下引用
	this.oldCloth = human[type]; 					// 原有的衣服的模型
	this.oldHumanAlpha = human.material.alphaMap; 	// 原有的人体透明贴图
	this.oldClothAlpha = human.clothAlpha[this.ctype];	// 原有的衣服透明贴图
	
	this.ctype = type; 			// 类型  "upcloth", "trousers" , "glasses", "shoes", "hair"
	
	this.type = this.ctype + 'UndressCommand';
};

UndressCommand.prototype = {

	execute : function() // 执行
	{
		var human = this.human;
		
		if(human[this.ctype] == undefined)		// 如果并没有穿衣服，误点的
		{
			console.log(human);
		}
		else
		{
			human[this.ctype] = undefined;				// 删除引用
			human.group.remove(this.oldCloth);			// 脱掉衣服
			human.clothAlpha[this.ctype] = undefined;	// 删除衣服对应的透明贴图
			human.mergeAlpha_0815(human);				// 旧版代码，合成透明贴图
		}
		

	}, // execute:function()

	undo : function() // 撤销
	{
		var human = this.human;
		if(this.oldCloth !== undefined)
		{
			human[this.ctype] = this.oldCloth;					// 重新加上引用
			human.group.add(this.oldCloth);						// 穿衣服
			human.clothAlpha[this.ctype] = this.oldClothAlpha;		// 将衣服携带的透明贴图归还
			human.material.alphaMap = this.oldHumanAlpha;			// 合成后的贴图附加在human材质上
			human.material.needsUpdate = true;
		    
		}
	      
	},
	
	update:function(command)
	   {
	      command.execute();
	   }

};
