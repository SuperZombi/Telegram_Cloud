var player1 = new Playerjs({id:"player1", file:"docs/Authorization_instructions.mp4"});
var player2 = new Playerjs({id:"player2", file:"docs/Upload_your_files.mp4"});
var player3 = new Playerjs({id:"player3", file:"docs/Работа с папками.mp4"});
var player4 = new Playerjs({id:"player4", file:"docs/Переименование и перемещение.mp4"});
var player5 = new Playerjs({id:"player5", file:"docs/Скачивание_удаление.mp4"});


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
