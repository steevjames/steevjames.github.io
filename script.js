
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



 function scrolltonav()
 {
    //  alert(window.scrollY);
    document.getElementById('navbar').scrollIntoView({block: 'start', behavior: 'smooth'});
 }

//  setTimeout(function(){
//     document.getElementById('footer').scrollIntoView({block: 'start', behavior: 'smooth'});
//     },500);