/*
<javascriptresource>
<name>Replace All Clips (Random)</name>
<enableinfo>true</enableinfo>
<menu>filter</menu> 
<category>UltimateScripts Clip 4</category> 
</javascriptresource>
*/



/*

UltimateScripts
by Zoltan Szalay
https://twitter.com/insgraphizm

Finds all layers that ends with (clip), and replaces them with random images from the preselected folder

If you get an error, you probably need to run "Select Folder of Images to Clip".

*/



#include "common.jsx";

app.activeDocument.suspendHistory("Replace All Clips (Random)", "main(imgDir)");

function main(inputFolder) {

	//var layers = getSelectedLayers();

	//var layers = findLayersByFirstChar('*');
	var layers = findLayersByEnd(pfx);
	var files = shuffle(getFilesFromFolder(imgDir));

	// if layers selected is less the images we have in the folder, we need more images in the array
	while (files.length < layers.length) files = files.concat(files);

	for (var i = 0; i < layers.length; ++i) {

		var targetLayer = files[i];

		if (layers[i].grouped && layers[i].kind == LayerKind.SMARTOBJECT) {
			//layers[i] = layers[i].merge();
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