/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param newMaterial THREE.Material
 * @constructor
 */

var SetMaterialCommand = function ( object, newMaterial ) {

	Command.call( this );

	this.type = 'SetMaterialCommand';
	this.name = 'New Material';

	this.object = object;
	this.oldMaterial = ( object !== undefined ) ? object.material : undefined;
	this.newMaterial = newMaterial;

};

SetMaterialCommand.prototype = {

	execute: function () {

			this.object.material = this.newMaterial;
			this.show.signals.materialChanged.dispatch( this.object.material );

	},

	undo: function () {

		if(this.object.parent instanceof THREE.Group)
		{
			var objArray = this.object.parent.children;
			for(var i = 0; i < objArray.length; i++)
			{
				objArray[i].material = this.oldMaterial;
			}

			this.show.signals.materialChanged.dispatch( this.object.material );
		}
		else {
			this.object.material = this.oldMaterial;
			this.show.signals.materialChanged.dispatch( this.object.material );
		}

	}

};
