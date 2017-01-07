/*
<javascriptresource>
<name>UltimateScripts</name>
<enableinfo>false</enableinfo>
<menu>filter</menu> 
<category>UltimateScripts 0</category> 
</javascriptresource>
*/



/*

UltimateScripts
by Zoltan Szalay
https://twitter.com/insgraphizm

Some of the functions are taken from 
https://github.com/iansilber/ig-design-tools
by Ian Silber

and from
http://uebelephoto.com/download%20center/watermark.zip
by Chuck Uebele

*/



/* Storing and retrieving preferences */

var pref = new File("~/Desktop/Ultimate Folder.txt");
var imgFolder;
var pfx = " (clip)";

function selectFolder() {
	imgFolder = Folder.selectDialog("Select source folder");
	writePrefs(imgFolder);
}

function writePrefs(prefString) {
	pref.open('w');
	pref.write(prefString);
	pref.close();
}

function readPrefs() {
	pref.open('r');
	var varUI = pref.read();
	imgFolder = varUI;
}




function moveLayerTo(fLayer, fX, fY) {
	var Position = fLayer.bounds;
	Position[0] = fX - Position[0];
	Position[1] = fY - Position[1];
	fLayer.translate(-Position[0], -Position[1]);
}

function shuffle(array) {
	var m = array.length, t, i;
	while (m > 0) {
		i = Math.floor(Math.random() * m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
}

if (typeof Array.prototype.indexOf != "function") {
	Array.prototype.indexOf = function(el) {
		for (var i = 0; i < this.length; i++)
			if (el === this[i]) return i;
		return -1;
	}
}

function createSmartObject(layer) {
	var doc = app.activeDocument;
	doc.activeLayer = layer || doc.activeLayer;
	try {
		var idnewPlacedLayer = stringIDToTypeID("newPlacedLayer");
		executeAction(idnewPlacedLayer, undefined, DialogModes.NO);
		return doc.activeLayer;
	} catch (e) {
		return undefined;
	}
}


function getSelectedLayersIdx() {
	var selectedLayers = new Array;
	var ref = new ActionReference();
	ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
	var desc = executeActionGet(ref);
	if (desc.hasKey(stringIDToTypeID('targetLayers'))) {
		desc = desc.getList(stringIDToTypeID('targetLayers'));
		var c = desc.count;
		var selectedLayers = new Array();
		for (var i = 0; i < c; i++) {
			try {
				app.activeDocument.backgroundLayer;
				selectedLayers.push(desc.getReference(i).getIndex());
			} catch (e) {
				selectedLayers.push(desc.getReference(i).getIndex() + 1);
			}
		}
	} else {
		var ref = new ActionReference();
		ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("ItmI"));
		ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
		try {
			app.activeDocument.backgroundLayer;
			selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")) - 1);
		} catch (e) {
			selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")));
		}
	}
	return selectedLayers;
}

function getSelectedLayers() {
	var selectedLayerIDs = getSelectedLayersIdx();
	var selectedLayers = new Array();
	for (var i = 0; i < selectedLayerIDs.length; i++) {
		makeActiveByIndex([selectedLayerIDs[i]], false);
		selectedLayers.push(activeDocument.activeLayer);
	}
	return selectedLayers;
}

function getFilesFromFolder(dir) {
	var fileIndexes = new Array();
	var folder = new Folder(dir);
	return folder.getFiles(/\.(jpg|tif|psd|bmp|gif|png|)$/i);
}

function makeActiveByIndex(idx, visible) {
	for (var i = 0; i < idx.length; i++) {
		var desc = new ActionDescriptor();
		var ref = new ActionReference();
		ref.putIndex(charIDToTypeID("Lyr "), idx[i]);
		desc.putReference(charIDToTypeID("null"), ref);
		if (i > 0) {
			var idselectionModifier = stringIDToTypeID("selectionModifier");
			var idselectionModifierType = stringIDToTypeID("selectionModifierType");
			var idaddToSelection = stringIDToTypeID("addToSelection");
			desc.putEnumerated(idselectionModifier, idselectionModifierType, idaddToSelection);
		}
		desc.putBoolean(charIDToTypeID("MkVs"), visible);
		executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
	}
}

function placeScaleRotateFile(file, xOffset, yOffset, theXScale, theYScale, theAngle, linked) {
	var idPlc = charIDToTypeID("Plc ");
	var desc5 = new ActionDescriptor();
	var idnull = charIDToTypeID("null");
	desc5.putPath(idnull, new File(file));
	var idFTcs = charIDToTypeID("FTcs");
	var idQCSt = charIDToTypeID("QCSt");
	var idQcsa = charIDToTypeID("Qcsa");
	desc5.putEnumerated(idFTcs, idQCSt, idQcsa);
	var idOfst = charIDToTypeID("Ofst");
	var desc6 = new ActionDescriptor();
	var idHrzn = charIDToTypeID("Hrzn");
	var idPxl = charIDToTypeID("#Pxl");
	desc6.putUnitDouble(idHrzn, idPxl, xOffset);
	var idVrtc = charIDToTypeID("Vrtc");
	var idPxl = charIDToTypeID("#Pxl");
	desc6.putUnitDouble(idVrtc, idPxl, yOffset);
	var idOfst = charIDToTypeID("Ofst");
	desc5.putObject(idOfst, idOfst, desc6);
	var idWdth = charIDToTypeID("Wdth");
	var idPrc = charIDToTypeID("#Prc");
	desc5.putUnitDouble(idWdth, idPrc, theYScale);
	var idHght = charIDToTypeID("Hght");
	var idPrc = charIDToTypeID("#Prc");
	desc5.putUnitDouble(idHght, idPrc, theXScale);
	var idAngl = charIDToTypeID("Angl");
	var idAng = charIDToTypeID("#Ang");
	desc5.putUnitDouble(idAngl, idAng, theAngle);
	if (linked == true) {
		var idLnkd = charIDToTypeID("Lnkd");
		desc5.putBoolean(idLnkd, true);
	};
	executeAction(idPlc, desc5, DialogModes.NO);
	return app.activeDocument.activeLayer;
};



function layerColour(colour) {
	switch (colour.toLocaleLowerCase()) {
		case 'red': colour = 'Rd  '; break;
		case 'orange' : colour = 'Orng'; break;
		case 'yellow' : colour = 'Ylw '; break;
		case 'yellow' : colour = 'Ylw '; break;
		case 'green' : colour = 'Grn '; break;
		case 'blue' : colour = 'Bl  '; break;
		case 'violet' : colour = 'Vlt '; break;
		case 'gray' : colour = 'Gry '; break;
		case 'none' : colour = 'None'; break;
		default : colour = 'None'; break;
	}
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
	desc.putReference(charIDToTypeID('null'), ref);
	var desc2 = new ActionDescriptor();
	desc2.putEnumerated(charIDToTypeID('Clr '), charIDToTypeID('Clr '), charIDToTypeID(colour));
	desc.putObject(charIDToTypeID('T   '), charIDToTypeID('Lyr '), desc2);
	executeAction(charIDToTypeID('setd'), desc, DialogModes.NO);
}

function getLayerVisibilityByIndex(idx) {
	if (idx) {
		var ref = new ActionReference();
		ref.putProperty(charIDToTypeID("Prpr") , charIDToTypeID("Vsbl"));
		ref.putIndex(charIDToTypeID("Lyr "), idx);
		return executeActionGet(ref).getBoolean(charIDToTypeID("Vsbl"));
	}
}

function selectLayerByIndex(index, add) {
	add = (add == undefined) ? add = false : add;
	var ref = new ActionReference();
	ref.putIndex(charIDToTypeID("Lyr "), index);
	var desc = new ActionDescriptor();
	desc.putReference(charIDToTypeID("null"), ref);

	if (add) desc.putEnumerated(stringIDToTypeID("selectionModifier"), stringIDToTypeID("selectionModifierType"), stringIDToTypeID("addToSelection"));

	desc.putBoolean(charIDToTypeID("MkVs"), false);

	try {
		executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
	} catch (e) {}
};

function selectAllLayers(layer) {
	if (layer == undefined) layer = 0;

	topLayer = true;
	if (!activeDocument.layers[0].visible) topLayer = false;

	activeDocument.activeLayer = activeDocument.layers[activeDocument.layers.length-1];
	if (activeDocument.activeLayer.isBackgroundLayer)
		if (!activeDocument.layers[activeDocument.layers.length-2].visible) {
			activeDocument.activeLayer = activeDocument.layers[activeDocument.layers.length-2];
			activeDocument.activeLayer.visible = false;
		} else {
			activeDocument.activeLayer = activeDocument.layers[activeDocument.layers.length-2];
		}

	var BL = activeDocument.activeLayer.name;
	activeDocument.activeLayer = activeDocument.layers[layer];
	var desc5 = new ActionDescriptor();
	var ref3 = new ActionReference();
	ref3.putName(charIDToTypeID('Lyr '), BL);
	desc5.putReference(charIDToTypeID('null'), ref3);
	desc5.putEnumerated(stringIDToTypeID('selectionModifier'), stringIDToTypeID('selectionModifierType'), stringIDToTypeID('addToSelectionContinuous'));
	desc5.putBoolean(charIDToTypeID('MkVs'), false);
	executeAction(charIDToTypeID('slct'), desc5, DialogModes.NO);
	if (!topLayer) activeDocument.layers[0].visible = false;
};
/*-----*/

/*
UPDATED from ig-design-tools
The third parameter accepts true or false.
If true image will be centered and scaled to fill the existingLayer below.
If false only width is taken into account, and positioned top-left (original)
*/
function resizeAndMoveLayer(newLayer, existingLayer, fill) {
	var tempWidth = newLayer.bounds[2] - newLayer.bounds[0];
	var tempHeight = newLayer.bounds[3] - newLayer.bounds[1];
	var width = existingLayer.bounds[2] - existingLayer.bounds[0] + 2;
	var height = existingLayer.bounds[3] - existingLayer.bounds[1] + 2;
	var scalePercent;

	scalePercent = width / tempWidth * 100;

	if (fill && height > tempHeight * scalePercent / 100) scalePercent = Math.ceil(height / tempHeight * 100);

	newLayer.resize(scalePercent, scalePercent);


	if (!fill) {
		moveLayerTo(newLayer, existingLayer.bounds[0].value, existingLayer.bounds[1].value);
	} else {
		var wdif = Math.floor((tempWidth*scalePercent/100 - width)/2);
		var hdif = Math.floor((tempHeight*scalePercent/100 - height)/2);
		moveLayerTo(newLayer, existingLayer.bounds[0].value-wdif-1, existingLayer.bounds[1].value-hdif-1);
	}
}







function fillCanvas(newLayer) {
	var tempWidth = newLayer.bounds[2] - newLayer.bounds[0];
	var tempHeight = newLayer.bounds[3] - newLayer.bounds[1];
	var width = app.activeDocument.width.value;
	var height = app.activeDocument.height.value;

	var scalePercent;

	scalePercent = width / tempWidth * 100;
	if (height > tempHeight * scalePercent / 100)
		scalePercent = height / tempHeight * 100;

	newLayer.resize(scalePercent, scalePercent);

	var wdif = Math.floor((tempWidth*scalePercent/100 - width)/2);
	var hdif = Math.floor((tempHeight*scalePercent/100 - height)/2);
	moveLayerTo(newLayer, -wdif, -hdif);
}

function removeExtension(fileNameString) {
	return fileNameString.substr(0, fileNameString.lastIndexOf("."));
}

function placeFile(file, activeLayer, fill) {
	var fileRef = File(file);
	var newLayer = placeScaleRotateFile(fileRef, 0, 0, 100, 100, 0, false);
	resizeAndMoveLayer(newLayer, activeLayer, fill);
	newLayer.name = fileRef.name.replace(".jpg", "");
	var newLayer = app.activeDocument.activeLayer;
	return newLayer;
}

/*
function findlayerBelow(layerName) {
	if (app.activeDocument.layers[app.activeDocument.layers.length-1] == layerName) {
		return false;
	} else {
		var i = 0;
		while (app.activeDocument.layers[i] != layerName) i++;
		return app.activeDocument.layers[i+1];
	}
}
*/

function findlayerBelow(layerName) {
	if (layerName.parent[layerName.parent.layers.length-1] == layerName) {
		return false;
	} else {
		var i = 0;
		while (layerName.parent.layers[i] != layerName) i++;
		return layerName.parent.layers[i+1];
	}
}

function findLayersByFirstChar(firstCharacter) {
	var layers = [];
	for (var i = 0; i < app.activeDocument.layers.length; ++i) {
		if (app.activeDocument.layers[i].name.charAt(0) == firstCharacter)
			layers.push(app.activeDocument.layers[i]);
	}
	return layers;
}

function findLayersByStart(preFix) {
	var layers = [];
	var ln = preFix.length;

	for (var i = 0; i < app.activeDocument.layers.length; ++i) {
		if (app.activeDocument.layers[i].name.substr(0,ln) == preFix)
			layers.push(app.activeDocument.layers[i]);
	}
	return layers;
}

function findLayersByEnd(postFix) {
	var layers = [];
	var ln = postFix.length;

	for (var i = 0; i < app.activeDocument.layers.length; ++i) {
		if (app.activeDocument.layers[i].name.substr(app.activeDocument.layers[i].name.length-ln) == postFix)
			layers.push(app.activeDocument.layers[i]);
	}
	return layers;
}


function addVGuide(coord) {
	for (var i = 0; i < activeDocument.guides.length; ++i)
		if (activeDocument.guides[i].direction == Direction.VERTICAL && activeDocument.guides[i].coordinate == coord) return false;
	app.activeDocument.guides.add(Direction.VERTICAL, new UnitValue(coord,"px"));
}

function addHGuide(coord) {
	for (var i = 0; i < activeDocument.guides.length; ++i)
		if (activeDocument.guides[i].direction == Direction.HORIZONTAL && activeDocument.guides[i].coordinate == coord) return false;
	app.activeDocument.guides.add(Direction.HORIZONTAL, new UnitValue(coord,"px"));
}