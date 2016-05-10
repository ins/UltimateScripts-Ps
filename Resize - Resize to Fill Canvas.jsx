/*
<javascriptresource>
<name>Resize to Fill Canvas</name>
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



#include "common.jsx";

app.activeDocument.suspendHistory("Resize to Fill Canvas", "main(imgDir)");

function main(inputFolder) {

	var layers = getSelectedLayers();

	for (var i = 0; i < layers.length; ++i)
		fillCanvas(layers[i]);
}