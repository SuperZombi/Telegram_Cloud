function switch_lang(){
	if (language == "RU"){
		language = "EN"
	}
	else if (language == "EN"){
		language = "RU"
	}
	change_lang()
}

function change_lang(){
	if (language == "RU"){
		document.getElementById('change_lan').src = "https://emojio.ru/images/twitter-64/1f1fa-1f1f8.png"
	}
	if (language == "EN"){
		document.getElementById('change_lan').src = "https://emojio.ru/images/twitter-64/1f1f7-1f1fa.png"
	}
	document.getElementById('change_lan').title = LANGUAGES[language].switch
	document.getElementById('up').title = LANGUAGES[language].up
	document.getElementById('href_text').innerHTML = LANGUAGES[language].back
	try{
		document.getElementById('what_is_it').innerHTML = LANGUAGES[language].what_is
		document.getElementById('what_is_it_text').innerHTML = LANGUAGES[language].what_is2
	}catch{}
	arr = document.getElementsByClassName('copy_link')
	for (i=0;i<arr.length;i++){
		arr[i].title = LANGUAGES[language].copy_link
	}
	document.getElementById('contens').innerHTML = LANGUAGES[language].contens
	document.getElementById('contens_install').innerHTML = LANGUAGES[language].install
	document.getElementById('install_h1').innerHTML = LANGUAGES[language].install + ":"
	document.getElementById('contens_auth').innerHTML = LANGUAGES[language].auth
	document.getElementById('auth_h1').innerHTML = LANGUAGES[language].auth + ":"
	document.getElementById('contens_update').innerHTML = LANGUAGES[language].update
	document.getElementById('update_h1').innerHTML = LANGUAGES[language].update + ":"
	document.getElementById('contens_work').innerHTML = LANGUAGES[language].work
	document.getElementById('contens_upload').innerHTML = LANGUAGES[language].upload
	document.getElementById('upload_h1').innerHTML = LANGUAGES[language].upload + ":"
	document.getElementById('contens_folders').innerHTML = LANGUAGES[language].folders
	document.getElementById('folders_h1').innerHTML = LANGUAGES[language].folders + ":"
	document.getElementById('contens_rename').innerHTML = LANGUAGES[language].rename
	document.getElementById('rename_h1').innerHTML = LANGUAGES[language].rename + ":"
	document.getElementById('contens_download').innerHTML = LANGUAGES[language].download
	document.getElementById('downl_h1').innerHTML = LANGUAGES[language].download + ":"
	document.getElementById('contens_dark').innerHTML = LANGUAGES[language].dark
	document.getElementById('dark_h1').innerHTML = LANGUAGES[language].dark + ":"
}
change_lang();
if (darkThemeMq.matches) {
	document.getElementById('slider').checked = false;
}
else {
	document.getElementById('slider').checked = true;
}

function copy_link(){
	setTimeout(function(){
		navigator.clipboard.writeText(window.location.href)
	}, 10)
}

// Canvas
var c=document.getElementById("nightsky");
var $k=c.getContext("2d");
var w=c.width=window.innerWidth;
var h=c.height=window.innerHeight;
var nodes;
var num=200;
var minDist=50;
var ver_speed=0;
var hor_speed=-0.07;
createPoints();
run();
function createPoints(){
	nodes=[];
	for(var a=0;a<num;a++){
		var b={rad:1,x:Math.random()*w,y:Math.random()*h,vx:hor_speed,vy:ver_speed,
			update:function(){
				this.x+=this.vx;
				this.y+=this.vy;
				if(this.x>w){
					this.x=0
				}
				else{
					if(this.x<0){
						this.x=w
					}
				}
				if(this.y>h){
					this.y=0
				}
				else{
					if(this.y<0){
						this.y=h
					}
				}
			},
			draw:function(){
				$k.fillStyle="rgba(255,255,255,1)";
				$k.beginPath();
				$k.arc(this.x,this.y,this.rad,0,Math.PI*2,true);
				$k.fill();
				$k.closePath()
			}
		};
		nodes.push(b)
	}
}
function run(){
	$k.fillStyle="#000110";
	$k.fillRect(0,0,w,h);
	for(i=0;i<num;i++){
		var d=nodes[i];
		nodes[i].update();
		nodes[i].draw();
		for(var a=i+1;a<num;a++){
			var b=nodes[a];
			connect(d,b)
		}
	}
	window.requestAnimationFrame(run)
}
function connect(d,a){
	var e=a.x-d.x;
	var b=a.y-d.y;
	var f=Math.sqrt(e*e+b*b);
	if(f<minDist){
		$k.lineWidth=1;
		$k.beginPath();
		$k.strokeStyle="rgba(255,255,255,.3)";
		$k.moveTo(d.x,d.y);
		$k.lineTo(a.x,a.y);
		$k.stroke();
		$k.closePath()
	}
}
window.addEventListener("resize",function(){
	c.width=w=window.innerWidth;
	c.height=h=window.innerHeight
});


// Canvas 2
/*
var c = document.getElementById('nightsky');
var ctx = c.getContext('2d');
var x = c.width = window.innerWidth;
var y = c.height = window.innerHeight;
var nStar = Math.round((x + y) / 5);
var randomSize = Math.floor((Math.random() * 2) + 1);

var stars = [];

function createStars() {
  'use strict';
  stars = [];
  for (var i = 0; i <= nStar; i++) {
    stars.push({
      x: Math.random() * x,
      y: Math.random() * y,
      o: Math.random(),
      r: Math.random(),
      s: 0.02,
    })
    if (randomSize > .1) {
      ctx.shadowBlur = Math.floor((Math.random() * 15));
      ctx.shadowColor = "white";
    }
  }
}

function drawing() {
  'use strict';
  requestAnimationFrame(drawing);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (var i = 0; i <= nStar; i++) {
    var e = stars[i];
    if (e.o > 1 || e.o < 0) {
      e.s = -e.s;
    }
    e.o += e.s;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2, false);
    ctx.strokeStyle = 'rgba(255, 255, 255, ' + e.o + ')';
    ctx.stroke();
  }
}
window.onload = function() {
  createStars();
  drawing();
};
*/
