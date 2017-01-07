/*
<javascriptresource>
<name>  Resize to Fill Layer Below</name>
<enableinfo>true</enableinfo>
<menu>filter</menu> 
<category>UltimateScripts Resize 1</category> 
</javascriptresource>
*/



/*

UltimateScripts
by Zoltan Szalay
https://twitter.com/insgraphizm

Resize and position selected layer to fill the layer below

*/



#target photoshop

#include "common.jsx";

if (app.documents.length)
	app.activeDocument.suspendHistory("Resize to Fill Layer Below", "main()");

function main() {

	var layers = getSelectedLayers();

	for (var i = 0; i < layers.length; ++i) {
	  	try {
	  		var targetLayer = findlayerBelow(layers[i]);	
		  	if (targetLayer == false) {
	 			fillCanvas(layers[i]);
		  	} else {
				resizeAndMoveLayer(layers[i], targetLayer, true);
			}
	  	} catch (e) {
		}
	}
}