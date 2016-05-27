/**
 * 添加模型命令
 */


var AddObjectCommand = function ( object ) {

	//alert("AddObjectCommand");
	command.call( this );

	this.type = 'AddObjectCommand';

	this.object = object;
	if ( object !== undefined ) {

		this.name = 'Add Object: ' + object.name;
		alert("AddObjectCommand:" + this.name);

	}

};

AddObjectCommand.prototype = {

	execute: function () {

		this.show.addObject( this.object );
		//this.show.select( this.object );

	},

	undo: function () {

		this.show.removeObject( this.object );
		//this.show.deselect();

	},

	toJSON: function () {

		var output = command.prototype.toJSON.call( this );
		output.object = this.object.toJSON();

		return output;

	},

	fromJSON: function ( json ) {

		command.prototype.fromJSON.call( this, json );

		this.object = this.show.objectByUuid( json.object.object.uuid );

		if ( this.object === undefined ) {

			var loader = new THREE.ObjectLoader();
			this.object = loader.parse( json.object );

		}

	}

};
