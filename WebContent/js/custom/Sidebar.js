/**
 * @author mrdoob / http://mrdoob.com/
 */

var Sidebar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'sidebar' );

	//

	var objectTab = new UI.Text( 'OBJECT' ).onClick( onClick );
	var materialTab = new UI.Text( 'MATERIAL' ).onClick( onClick );

	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add( objectTab, materialTab );
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

	//

	var object = new UI.Span().add(
		new Sidebar.Object( editor )
	);
	container.add( object );

	var material = new UI.Span().add(
		new Sidebar.Material( editor )
	);
	container.add( material );

//
function select( section ) {

	objectTab.setClass( '' );
	materialTab.setClass( '' );

	object.setDisplay( 'none' );
	material.setDisplay( 'none' );

	switch ( section ) {
		case 'OBJECT':
			objectTab.setClass( 'selected' );
			object.setDisplay( '' );
			break;
		case 'MATERIAL':
			materialTab.setClass( 'selected' );
			material.setDisplay( '' );
			break;
	}

}

	select( 'MATERIAL' );

	return container;

};
