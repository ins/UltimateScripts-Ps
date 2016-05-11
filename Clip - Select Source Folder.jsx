/*
<javascriptresource>
<name>  Select Source Folder</name>
<enableinfo>true</enableinfo>
<menu>filter</menu> 
<category>UltimateScripts Clip 1</category> 
</javascriptresource>
*/



/*

UltimateScripts
by Zoltan Szalay
https://twitter.com/insgraphizm

Dialog to select a folder, to be used when loading images.
Folder is saved as preferences to the desktop in a file called "Ultimate Folder.txt"

*/



#target photoshop

#include "common.jsx";

if ( app.documents.length == 0 ) {
	selectFolder();
} else {
	app.activeDocument.suspendHistory("Select source folder", "selectFolder()");
}