/*
<javascriptresource>
<name>  Clip Images to Selected Layers</name>
<enableinfo>true</enableinfo>
<menu>filter</menu>
<category>UltimateScripts Clip 2</category>
</javascriptresource>
*/



/*

UltimateScripts
by Zoltan Szalay
https://twitter.com/insgraphizm

Load images from the selected folder.
Place in order above selected layers.
Selected layers will be clipping masks.
Images placed as smart objects.
Centered and resized to fill the clipping mask.

If the selected layer is a previously placed image - a (clip) - then that will be replaced with a new image.

*/



#target photoshop

#include "common.jsx";

if ( app.documents.length == 0 ) {
	alert("There are no documents open.");
} else {
	app.activeDocument.suspendHistory("Clip Images to Selected Layers", "checkPrefs()");
}

function checkPrefs() {
	if (pref.exists) {
		readPrefs();
	} else {
		selectFolder();
	}
	main();
}

function main() {

	var layers = getSelectedLayers();
	var files = getFilesFromFolder(imgFolder);

	// if more layers are selected than how many images we have in the folder
	while (files.length < layers.length) files = files.concat(files);

	for (var i = 0; i < layers.length; ++i) {

		if (layers[i].name.substr(layers[i].name.length-pfx.length) == pfx) {
			
			// layers is a clip, replace with another image

			var targetLayer = findlayerBelow(layers[i]);
			if (targetLayer != false) layers[i].remove();
			
		} else {
		
			// else clip a new image to this layer
			var targetLayer = layers[i];

		}

		//newLayer.rasterize(RasterizeType.ENTIRELAYER);
		var newLayer = placeFile(files[i], targetLayer, true);
		newLayer.name += pfx;
		newLayer.move(targetLayer, ElementPlacement.PLACEBEFORE);
		newLayer.grouped = true;
	}
}