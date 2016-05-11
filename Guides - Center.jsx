/*
<javascriptresource>
<name>  Center</name>
<enableinfo>true</enableinfo>
<menu>filter</menu> 
<category>UltimateScripts Guides 2</category> 
</javascriptresource>
*/



/*

UltimateScripts
by Zoltan Szalay
https://twitter.com/insgraphizm

Create guidelines at vertical and horizontal center of canvas or selection

*/



app.activeDocument.suspendHistory("Guides at Center", "main()");

function main() {

	if ( app.documents.length == 0 )
	{
		alert("There are no documents open.");
	}
	else
	{
		var ou = preferences.rulerUnits;
		preferences.rulerUnits = Units.PIXELS;
		var ad = activeDocument;
		
		var left;
		var top;
		var width;
		var height;

		// use selection or document width
		try {
			left = ad.selection.bounds[0];
			top = ad.selection.bounds[1];
			width = ad.selection.bounds[2] - ad.selection.bounds[0];
			height = ad.selection.bounds[3] - ad.selection.bounds[1];
		} catch (e) {
			left = 0;
			top = 0;
			width = ad.width.value;
			height = ad.height.value;
		}

		ad.guides.add(Direction.VERTICAL, new UnitValue(left + width/2,"px"));
		ad.guides.add(Direction.HORIZONTAL, new UnitValue(top + height/2,"px"));

		preferences.rulerUnits = ou;

		ad = null;
		ou = null;
		left = null;
		top = null;
		width = null;
		height = null;
	}
}