/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param attributeName string
 * @param newValue integer representing a hex color value
 * @constructor
 */

var SetMaterialColorCommand = function ( object, attributeName, newValue ) {

	Command.call( this );

	this.type = 'SetMaterialColorCommand';
	this.name = 'Set Material.' + attributeName;
	this.updatable = true;

	this.object = object;
	this.attributeName = attributeName;
	this.oldValue = ( object !== undefined ) ? this.object.material[ this.attributeName ].getHex() : undefined;
	this.newValue = newValue;

};

SetMaterialColorCommand.prototype = {

	execute: function () {

//		if(this.object.parent instanceof THREE.Group)
//		{
//			var objArray = this.object.parent.children;
//			for(var i = 0; i < objArray.length; i++)
//			{
//				objArray[i].material[ this.attributeName ].setHex( this.newValue );
//			}
//
//			this.show.signals.materialChanged.dispatch( this.object.material );
//		}
//		else {
			this.object.material[ this.attributeName ].setHex( this.newValue );
			this.show.signals.materialChanged.dispatch( this.object.material );
//		}

	},

	undo: function () {

		if(this.object.parent instanceof THREE.Group)
		{
			var objArray = this.object.parent.children;
			for(var i = 0; i < objArray.length; i++)
			{
				objArray[i].material[ this.attributeName ].setHex( this.oldValue );
			}

			this.show.signals.materialChanged.dispatch( this.object.material );
		}
		else {
			this.object.material[ this.attributeName ].setHex( this.oldValue );
			this.show.signals.materialChanged.dispatch( this.object.material );
		}

	},

	update: function ( cmd ) {

		this.newValue = cmd.newValue;

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.attributeName = this.attributeName;
		output.oldValue = this.oldValue;
		output.newValue = this.newValue;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.show.objectByUuid( json.objectUuid );
		this.attributeName = json.attributeName;
		this.oldValue = json.oldValue;
		this.newValue = json.newValue;

	}

};
