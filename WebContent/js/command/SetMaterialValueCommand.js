/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param attributeName string
 * @param newValue number, string, boolean or object
 * @constructor
 */

var SetMaterialValueCommand = function ( object, attributeName, newValue ) {

	Command.call( this );

	this.type = 'SetMaterialValueCommand';
	this.name = 'Set Material.' + attributeName;
	this.updatable = true;

	this.object = object;
	this.oldValue = ( object !== undefined ) ? object.material[ attributeName ] : undefined;
	this.newValue = newValue;
	this.attributeName = attributeName;

};

SetMaterialValueCommand.prototype = {

	execute: function () {

			this.object.material[ this.attributeName ] = this.newValue;
			this.object.material.needsUpdate = true;
			this.show.signals.materialChanged.dispatch( this.object.material );

	},

	undo: function () {

			this.object.material[ this.attributeName ] = this.oldValue;
			this.object.material.needsUpdate = true;
			this.show.signals.materialChanged.dispatch( this.object.material );

	},

	update: function ( cmd ) {

		this.newValue = cmd.newValue;

	}


};
