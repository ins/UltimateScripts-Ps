/*
<javascriptresource>
<name>  Rule of Thirds</name>
<enableinfo>true</enableinfo>
<menu>filter</menu> 
<category>UltimateScripts Guides 3</category> 
</javascriptresource>
*/



/*

UltimateScripts
by Zoltan Szalay
https://twitter.com/insgraphizm

Create rule of thirds guidelines based on selection or selected layers.

*/

#target photoshop

#include "common.jsx";

if ( app.documents.length == 0 ) {
	alert("There are no documents open.");
} else {
	app.activeDocument.suspendHistory("Guides at Rule of Thirds", "main()");
}

function main() {
	var ou = preferences.rulerUnits;
	preferences.rulerUnits = Units.PIXELS;
	
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
		addGuides(left, top, width, height);
	} catch (e) {
		if (layers.length == 0) {
			// use canvas
			addGuides(0, 0, activeDocument.width.value, activeDocument.height.value);
		} else {
			// use selected layers
			for (var i = 0; i < layers.length; ++i) {
				var lb = layers[i].bounds;
				left = lb[0];
				top = lb[1];
				width = lb[2] - lb[0];
				height = lb[3] - lb[1];
				addGuides(left, top, width, height);
			}
		}
	}

	preferences.rulerUnits = ou;
}

function addGuides(left, top, width, height) {
	addVGuide(left);
	addVGuide(left + width);
	addVGuide(left + Math.round(width/3));
	addVGuide(left + Math.round(width/3)*2);

	addHGuide(top);
	addHGuide(top + height);
	addHGuide(top + Math.round(height/3));
	addHGuide(top + Math.round(height/3)*2);
}