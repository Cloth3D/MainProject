/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param editorRef pointer to main editor object used to initialize
 *        each command object with a reference to the editor
 * @constructor
 */

var Command = function ( showRef ) {

	this.id = - 1;
	this.inMemory = false;
	this.updatable = false;
	this.type = '';
	this.name = '';

	if ( showRef !== undefined ) {

		Command.show = showRef;																	// 静态类成员变量

	}
	this.show = Command.show;
};
