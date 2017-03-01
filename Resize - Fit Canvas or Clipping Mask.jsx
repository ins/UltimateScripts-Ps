/*
<javascriptresource>
<name>  Fit Canvas or Clipping Mask</name>
<enableinfo>true</enableinfo>
<menu>filter</menu> 
<category>UltimateScripts Resize 2</category> 
</javascriptresource>
*/



/*

UltimateScripts
by Zoltan Szalay
https://twitter.com/insgraphizm

Resize and center selected layer(s) to fit the canvas, or the clipping mask.

*/



#target photoshop

#include "common.jsx";

if (app.documents.length)
	app.activeDocument.suspendHistory("Resize to Fill Canvas", "main()");

function main() {

	var layers = getSelectedLayers();

	for (var i = 0; i < layers.length; ++i) {
	  	try {
	  		var targetLayer = findlayerBelow(layers[i]);	
		  	if (targetLayer == false || layers[i].grouped == false) {
	 			fillCanvas(layers[i]);
		  	} else {
				resizeAndMoveLayer(layers[i], targetLayer);
			}
	  	} catch (e) {
		}
	}
}