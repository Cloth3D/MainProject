/**
 * @author Chao Qun
 * 功能
 */


 var SetFigureCommand = function(human, scale, scaleType)
 /**
  * parameters
  * human: 对应的人体类
  * scale: 对应的缩放参数
  * scaleType: 对应的缩放类型: 'height', 'figure'
  */
 {
   Command.call(this);

   this.human = human;
   this.type = 'SetFigureCommand';
   this.name = '体型操作';
   this.updatable = true;

   this.FigureType = scaleType;

   this.oldScale = 0;
   this.newScale = scale;

   switch (scaleType) {
     case 'height':
     this.lastScale = this.human.heightScale;
     break;

     case 'figure':
     this.lastScale = this.human.fingerScale;
     break;

     default:

   }
 };

 SetFigureCommand.prototype = {
   execute:function()
   {
     switch (this.FigureType) {
       case 'height':
        this.human.adjustHeight(this.human, this.newScale);
        this.human.adjustHuman(this.human);
       break;

       case 'figure':
       this.human.adjustFigure(this.human, this.newScale);
       this.human.adjustHuman(this.human);
       break;
       default:

     }

   },

   undo:function()
   {
     switch (this.FigureType) {
       case 'height':
        this.human.adjustHeight(this.human, this.oldScale);
        this.human.adjustHuman(this.human);
       break;

       case 'figure':
       this.human.adjustFigure(this.human, this.oldScale);
       this.human.adjustHuman(this.human);
       break;
       default:

     }
   },

   update:function(command)
   {
      this.newScale = command.newScale;
   }
 }
