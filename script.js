function animate()
{

document.getElementById('main').style.backgroundColor='rgba(0,0,0,.5)';
document.getElementById('title').style.fontSize='8vw';
setTimeout(function(){
	document.getElementById('subtitle').style.fontSize='40%';
	document.getElementById('main').style.animation='opacity 6s infinite';
	},3000);
}
setTimeout(animate, 500);
