function animate()
{

	// document.getElementById('main').style.backgroundColor='rgba(0,0,0,.5)';
	if(window.innerWidth>600)	document.getElementById('title').style.fontSize='6vw';
	else document.getElementById('title').style.fontSize='8vw';
	setTimeout(function(){
		document.getElementById('subtitle').style.fontSize='40%';
		},3000);
}
setTimeout(animate, 100);







if(window.innerWidth>600)
document.getElementById('out').style.height = 'calc( 100vh - '+document.getElementById('navbar').clientHeight+'px )';


function shownav() {
    document.getElementById("navtoggle").classList.remove("navright");
    document.getElementById("navtoggle").classList.add("navmenu");
    document.getElementById("navcontainer").classList.add("center");
    document.getElementById("oldnav").style.display='block';
 }
 function hidenav() {
    document.getElementById("navtoggle").classList.remove("navmenu");
    document.getElementById("navtoggle").classList.add("navright");
    document.getElementById("navcontainer").classList.remove("center");
    document.getElementById("oldnav").style.display='none';
 }
 document.getElementById("navbtn").addEventListener("click", shownav);
 document.getElementById("oldnav").addEventListener("click", hidenav);

