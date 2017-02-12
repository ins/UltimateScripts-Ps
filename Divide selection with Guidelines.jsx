/*
<javascriptresource>
<name>  Divide selection with Guidelines</name>
<enableinfo>true</enableinfo>
<menu>filter</menu> 
<category>UltimateScripts Guides 1</category> 
</javascriptresource>
*/



/*

UltimateScripts
by Zoltan Szalay
https://twitter.com/insgraphizm

Create guidelines based on selection - edge, center, thirds, grids.

*/

#target photoshop

#include "common.jsx";

if (app.documents.length)
	app.activeDocument.suspendHistory("Guides at Rule of Sevenths", "main()");

function main() {
	var ou = preferences.rulerUnits;
	preferences.rulerUnits = Units.PIXELS;

	var dvsn = prompt("Separate horizontal/vertical divisions with /.\nFor even horizontal/vertical divisions use one number.\nTo clear guides before, start with *.\n(try: Esc or 1, 2, 3, *3, 4/3, *3/10", "", "Enter divisions");

	if (dvsn != null && dvsn.charAt(0) == "*") {
		clearCanvasGuides();
		dvsn = dvsn.substr(1);
	}

	if (dvsn == null || (dvsn > 0 && dvsn < 10000) || dvsn.indexOf("/") > 0) {
	
		var left;
		var top;
		var width;
		var height;

		var layers = getSelectedLayers();

		try {
			// use selection
			var sb = activeDocument.selection.bounds;
			left = sb[0];
			top = sb[1];
			width = sb[2] - sb[0];
			height = sb[3] - sb[1];
			addGuides(left, top, width, height, dvsn);
		} catch (e) {
			if (layers.length == 0) {
				// use canvas
				addGuides(0, 0, activeDocument.width.value, activeDocument.height.value, dvsn);
			} else {
				// use selected layers
				for (var i = 0; i < layers.length; ++i) {
					var lb = layers[i].bounds;
					left = lb[0];
					top = lb[1];
					width = lb[2] - lb[0];
					height = lb[3] - lb[1];
					addGuides(left, top, width, height, dvsn);
				}
			}
		}
	}

	preferences.rulerUnits = ou;
}

function addGuides(left, top, width, height, div) {
	
	addVGuide(left);
	addVGuide(left + width);
	addHGuide(top);
	addHGuide(top + height);

	if (div != null) {

		var divisionsX = div;
		var divisionsY = div;

		if (div.indexOf("/") > 0) {
			divisionsX = div.split("/")[0];
			divisionsY = div.split("/")[1];
		}


		for (i = 1; i < divisionsX; i++) {
			addVGuide(left + Math.round(width/divisionsX*i));
		}

		for (i = 1; i < divisionsY; i++) {
			addHGuide(top + Math.round(height/divisionsY*i));
		}
	}
}


function clearCanvasGuides() {
	var idclearCanvasGuides = stringIDToTypeID( "clearCanvasGuides" );
	executeAction( idclearCanvasGuides, undefined, DialogModes.NO );
}