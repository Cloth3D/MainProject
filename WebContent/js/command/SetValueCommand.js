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

var SetValueCommand = function ( object, attributeName, newValue ) {

	Command.call( this );

	this.type = 'SetValueCommand';
	this.name = 'Set ' + attributeName;
	this.updatable = true;

	this.object = object;
	this.attributeName = attributeName;
	this.oldValue = ( object !== undefined ) ? object[ attributeName ] : undefined;
	this.newValue = newValue;

};

SetValueCommand.prototype = {

	execute: function () {

		this.object[ this.attributeName ] = this.newValue;
		this.show.signals.objectChanged.dispatch( this.object );
		// this.show.signals.sceneGraphChanged.dispatch();

	},

	undo: function () {

		this.object[ this.attributeName ] = this.oldValue;
		this.show.signals.objectChanged.dispatch( this.object );
		// this.show.signals.sceneGraphChanged.dispatch();

	},

	update: function ( cmd ) {

		this.newValue = cmd.newValue;

	}

};
