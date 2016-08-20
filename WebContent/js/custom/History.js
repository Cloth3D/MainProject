/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

History = function ( show ) {

	this.show = show;																	// show-reference
	this.undos = [];																	// 撤销
	this.redos = [];																	// 恢复
	this.lastCmdTime = new Date();
	this.idCounter = 0;																// undos.length

	this.historyDisabled = false;											// 正在进行一些特殊操作时应暂时禁止撤销恢复

	//Set show-reference in Command

	Command( show );

};

History.prototype = {

	execute: function ( cmd, optionalName ) {

		var lastCmd = this.undos[ this.undos.length - 1 ];																// 上一次操作操作
		var timeDifference = new Date().getTime() - this.lastCmdTime.getTime();						// 两次操作时间差

		var isUpdatableCmd = lastCmd &&									// 用来判断是否是，鼠标拖动等操作
			lastCmd.updatable &&
			cmd.updatable &&
			lastCmd.object === cmd.object &&
			lastCmd.type === cmd.type &&
			lastCmd.attributeName === cmd.attributeName;

		if ( isUpdatableCmd && timeDifference < 500 ) {										// 时间长度超过半秒后生成新的操作

			lastCmd.update( cmd );
			cmd = lastCmd;

		} else {

			this.undos.push( cmd );
			cmd.id = ++ this.idCounter;

		}

		cmd.name = ( optionalName !== undefined ) ? optionalName : cmd.name;
		cmd.execute();
		cmd.inMemory = true;

		this.lastCmdTime = new Date();												// 更新上次操作时间

		// 一旦进行了新的操作，恢复队列便可以清除了

		this.redos = [];

	},

	undo: function () {

		if ( this.historyDisabled ) {								// 可以设置走T台时不播放动画

			alert( "Undo/Redo disabled while scene is playing." );
			return;

		}

		var cmd = undefined;

		if ( this.undos.length > 0 ) {

			cmd = this.undos.pop();

		}

		if ( cmd !== undefined ) {

			cmd.undo();
			this.redos.push( cmd );															// 撤销之后将cmd放入恢复队列

		}

		return cmd;

	},

	redo: function () {

		if ( this.historyDisabled ) {

			alert( "Undo/Redo disabled while scene is playing." );
			return;

		}

		var cmd = undefined;

		if ( this.redos.length > 0 ) {

			cmd = this.redos.pop();

		}

		if ( cmd !== undefined ) {

			cmd.execute();
			this.undos.push( cmd );													// 恢复之后将操作放入撤销队列

		}

		return cmd;

	},

	clear: function () {

		this.undos = [];
		this.redos = [];
		this.idCounter = 0;

	},

	goToState: function ( id ) {

		if ( this.historyDisabled ) {

			alert( "Undo/Redo disabled while scene is playing." );
			return;

		}

		var cmd = this.undos.length > 0 ? this.undos[ this.undos.length - 1 ] : undefined;	// next cmd to pop

		if ( cmd === undefined || id > cmd.id ) {

			cmd = this.redo();
			while ( cmd !== undefined && id > cmd.id ) {

				cmd = this.redo();

			}

		} else {

			while ( true ) {

				cmd = this.undos[ this.undos.length - 1 ];	// next cmd to pop

				if ( cmd === undefined || id === cmd.id ) break;

				cmd = this.undo();

			}

		}

	},

	enableSerialization: function ( id ) {

		/**
		 * because there might be commands in this.undos and this.redos
		 * which have not been serialized with .toJSON() we go back
		 * to the oldest command and redo one command after the other
		 * while also calling .toJSON() on them.
		 */

		this.goToState( - 1 );

		var cmd = this.redo();
		while ( cmd !== undefined ) {

			if ( ! cmd.hasOwnProperty( "json" ) ) {

				cmd.json = cmd.toJSON();

			}
			cmd = this.redo();

		}

		this.goToState( id );

	}

};
