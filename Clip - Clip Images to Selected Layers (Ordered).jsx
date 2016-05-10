/*
<javascriptresource>
<name>Clip Images to Selected Layers (Ordered)</name>
<enableinfo>true</enableinfo>
<menu>filter</menu>
<category>UltimateScripts Clip 2</category>
</javascriptresource>
*/



/*

UltimateScripts
by Zoltan Szalay
https://twitter.com/insgraphizm

Loads images from the preselected folder
Makes clipping masks from the selected layers
Positions and resizes images to fill the clipping mask

If the selected layer is a previously placed image
this script will replace it with a new image

If you get an error, you probably need to run "Select Folder of Images to Clip".

*/



#target photoshop

#include "common.jsx";

//app.activeDocument.suspendHistory("Clip Random Image to Selected Layer", "selectFolder()");
app.activeDocument.suspendHistory("Clip Images to Selected Layers (Ordered)", "main(imgDir)");


function selectFolder() {
	var inputFolder = Folder.selectDialog("Select a folder of documents to process");
	main(inputFolder);
}

function main(inputFolder) {

	var layers = getSelectedLayers();
	var files = getFilesFromFolder(inputFolder);

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