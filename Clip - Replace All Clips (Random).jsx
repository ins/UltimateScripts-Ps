/*
<javascriptresource>
<name>  Replace All Clips (Random)</name>
<enableinfo>true</enableinfo>
<menu>filter</menu> 
<category>UltimateScripts Clip 4</category> 
</javascriptresource>
*/



/*

UltimateScripts
by Zoltan Szalay
https://twitter.com/insgraphizm

Find all layers that ends with " (clip)"
Load images from the selected folder.
Place images in RANDOM order above found layers.
Found layers will be clipping masks.
Images placed as smart objects.
Centered and resized to fill the clipping mask.

If the selected layer is a previously placed image - a (clip) - then that will be replaced with a new image.

*/

#target photoshop

#include "common.jsx";

if ( app.documents.length == 0 ) {
	alert("There are no documents open.");
} else {
	app.activeDocument.suspendHistory("Replace All Clips (Random)", "checkPrefs()");
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
	var layers = findLayersByEnd(pfx);
	var files = shuffle(getFilesFromFolder(imgFolder));

	// if layers selected is less the images we have in the folder, we need more images in the array
	while (files.length < layers.length) files = files.concat(files);

	for (var i = 0; i < layers.length; ++i) {

		var targetLayer = files[i];

		if (layers[i].grouped && layers[i].kind == LayerKind.SMARTOBJECT) {
			var targetLayer = findlayerBelow(layers[i]);
			if (targetLayer != false) layers[i].remove();

			var newLayer = placeFile(files[i], targetLayer, true);

			newLayer.name = removeExtension(newLayer.name)+pfx;
			//newLayer.rasterize(RasterizeType.ENTIRELAYER);

			newLayer.move(targetLayer, ElementPlacement.PLACEBEFORE);
			newLayer.grouped = true;
		}
	}
}