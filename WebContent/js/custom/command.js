/**
 * 操作命令
 */

var command = function ( showRef ) {
	//alert("command");
	this.id = - 1;
	this.inMemory = false;//？？？
	this.updatable = false;
	this.type = '';
	this.name = '';

	if ( showRef !== undefined ) {

		command.show = showRef;

	}
	this.show = command.show;
};

command.prototype.toJSON = function () {

	var output = {};
	output.type = this.type;
	output.id = this.id;
	output.name = this.name;
	return output;

};

command.prototype.fromJSON = function ( json ) {

	this.inMemory = true;
	this.type = json.type;
	this.id = json.id;
	this.name = json.name;

};
