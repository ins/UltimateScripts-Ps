/*
<javascriptresource>
<name>  Resize to Fill Canvas</name>
<enableinfo>true</enableinfo>
<menu>filter</menu> 
<category>UltimateScripts Resize 2</category> 
</javascriptresource>
*/



/*

UltimateScripts
by Zoltan Szalay
https://twitter.com/insgraphizm

Resize and position selected layer to fill the canvas

*/



#target photoshop

#include "common.jsx";

if ( app.documents.length == 0 ) {
	alert("There are no documents open.");
} else {
	app.activeDocument.suspendHistory("Resize to Fill Canvas", "main()");
}

function main() {

	var layers = getSelectedLayers();

	for (var i = 0; i < layers.length; ++i)
		fillCanvas(layers[i]);
}