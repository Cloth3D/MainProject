/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param newPosition THREE.Vector3
 * @param optionalOldPosition THREE.Vector3
 * @constructor
 */

var SetPositionCommand = function ( object, newPosition, optionalOldPosition ) {

	Command.call( this );

	this.type = 'SetPositionCommand';
	this.name = 'Set Position';
	this.updatable = true;

	this.object = object;

	if ( object !== undefined && newPosition !== undefined ) {

		this.oldPosition = object.position.clone();
		this.newPosition = newPosition.clone();

	}

	if ( optionalOldPosition !== undefined ) {

		this.oldPosition = optionalOldPosition.clone();

	}

};
SetPositionCommand.prototype = {

	execute: function () {

		this.object.position.copy( this.newPosition );
		this.object.updateMatrixWorld( true );
		this.show.signals.objectChanged.dispatch( this.object );
	},

	undo: function () {

		this.object.position.copy( this.oldPosition );
		this.object.updateMatrixWorld( true );
		this.show.signals.objectChanged.dispatch( this.object );
	},

	update: function ( command ) {

		this.newPosition.copy( command.newPosition );
	},

};
