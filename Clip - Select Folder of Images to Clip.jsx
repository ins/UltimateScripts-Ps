/*
<javascriptresource>
<name>Select Folder of Images to Clip</name>
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
Saves this information to the desktop in a file called "UltimateScripts Settings.jsx"

If the "UltimateScripts Settings.jsx" doesn't exists the Clip scripts won't work.

*/



#target photoshop

var FPath = "~/Desktop";

app.activeDocument.suspendHistory("Select Folder of Images to Clip", "selectFolder()");

function selectFolder() {
  var inputFolder = Folder.selectDialog("Select a folder of images to clip");
  main(inputFolder);
}

function main(inputFolder) {
  writeFile("var imgDir = \""+inputFolder+"\";\nvar pfx = \" (clip)\";");
}

// Export to txt file
function writeFile(info) {
  try {
    var f = new File(FPath + "/UltimateScripts Settings.jsx");
    f.remove();
    f.open('a');
    f.lineFeed = "Windows";
    f.write(info);
    f.close();
  }
  catch(e){}
}