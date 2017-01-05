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

	var dvsn = prompt("Enter divisions: (eg: 2 - edges and centerlines, 3 - rule of thirds, 4 - 4x4 grid. Esc - edges only)", "", "Division");

	if (dvsn == null || (dvsn > 1 && dvsn < 10000) ) {
	
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

function addGuides(left, top, width, height, divisions) {
	addVGuide(left);
	addVGuide(left + width);
	addHGuide(top);
	addHGuide(top + height);

	for (i = 1; i < divisions; i++) {
		addVGuide(left + Math.round(width/divisions*i));
		addHGuide(top + Math.round(height/divisions*i));
	}
}