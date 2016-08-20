/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @constructor
 */

var RemoveObjectCommand = function ( object ) {

	Command.call( this );

	this.type = 'RemoveObjectCommand';
	this.name = 'Remove Object';

	this.object = object;

};

RemoveObjectCommand.prototype = {

	execute: function () {
		if (this.object == undefined)		return;				// 避免出现误操作
		var scope = this.show;
		scope.removeObject(show, this.object);

		show.selected = null;
		show.selectNeedUpdate = true;

	},

	undo: function () {
		if(this.object == undefined)	return;					// 避免出现误操作

		var scope = this.show;
		scope.addObject(this.object);

	},

};
