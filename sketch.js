
var sx1=[],sy1=[];
var sx2=[],sy2=[];
var sx=[],sy=[];
var xst=[],yst=[];
var xa=[],ya=[];
//imageMode(CENTER);
//var h=100;
var w1=50;
var w2=50;
var b=100;
//var hma=3
var ch=0;
var gs=0;
//var i=30;
var y=200;
  var gs=false;
var ys=2;
var as=5;
var rec=1249;//W/5 asts.
var hma=2;
function setup(){
function randoms(l,h){
  return Math.random()*h;
}
  createCanvas(400,400)
 // var gs=false;
//var ys=2;
//var as=5;
//var rec=1249;//W/5 asts.
//var hma=2;
// //draw= function() {

// //draw= function() {
//smooth();
for(var i=0;i<10;i++){
    sx.push(50+randoms(-25,25));
    sy.push(200);
}

for(var i=0;i<10;i++){
    sx1.push(50+randoms(-25,25));
    sy1.push(190);
}

for(var i=0;i<10;i++){
    sx2.push(50+randoms(-25,25));
    sy2.push(210);
}


for(var i=0;i<200;i++){
    xst.push(randoms(0,400));
    yst.push(randoms(0,400));
}
for(var i=0;i<hma;i++){
    xa.push(randoms(880,1580));
    ya.push(randoms(0,400));
}
//textAlign(CENTER);
//draw=function(){
fill(11, 0, 227);
text("click to play\n\n rules:\narrow keys to go up / down\ndodge the asteroids\n click and hold to pause",200,200);
}
draw= function() {
    if(mouseIsPressed){
        gs=1;
    }
    if(gs&&!mouseIsPressed){//no indent
    
    ys+=0.002;
    as+=0.002;
    //dsdfdff
    if(y>400||y<0){
        w1=-0;
        b=-35;//h=-1;
    }
    background(0,0, 0);
    text("my record is... "+ rec,200,10);
    //textSize(100);
    //i-=1/60;
    //text(i,200,200);
    
    if(keyCode===38&&keyIsPressed){
        y-=ys;
    }if(keyCode===40&&keyIsPressed){
        y+=ys;
    }
    
    for(var i=0;i<200;i++){
        xst[i]-=random(0,1);
        if(xst[i]<0){
            xst[i]=400;
            yst[i]=random(0,400);
        }
        stroke(255, 255, 255);
        fill(255, 255, 255);
        var s=random(0,4);
        fill(64, 56, 56);
        ellipse(xst[i],yst[i],s,s);
    }
    //ellipse(50,y,50,50);
    //translate(30,30);
    //ellipse(50,y,50,50);
    //noLoop();
    //image(getImage("space/rocketship"),50,y,100,100);
    //fill(255,255,255,100);
    //ellipse(50,y,50,50);
    //image(getImage("space/rocketship"),47,y-7,60,80);
    //Loop();
    //ellipse(50,y,50,50);
    
    translate(0,y-200);
    //noLoop();
    //b=30;
    var q=random(0,255);
    fill(q,q-random(0,255),0);
    
    triangle(0,210,0,190,40,200);
    
    if(b>90){
        fill(56);
        triangle(25,180,25,220,75,200);
        //triangle(50,200,50,225,75,200);
        
        //triangle(50,175,50,200,75,200);
        
    }else{
        //fill(89, 255, 0);
        fill(56,56,56);
        triangle(25,180,25,220,58,200);
        //noStroke();
        triangle(43,180,36,218,58,200);
        stroke(255, 255, 255);
        //triangle(50,200,50,225,70,200);
        //triangle(50,175,50,200,70,200);
        noStroke();
        triangle(64,188,50,198,70,210);
        fill(255, 0, 0);
        
        translate(0,-(y-200));
        rect(0,0,400,50);
        fill(0, 0, 0);
        
        text("WARNING: SHIP IS GOING TO EXPLODE",10,10);
        
        translate(0,y-200);
        fill(120, 120, 120);
        b-=0.05;
        for(var i=0;i<10;i++){
            //b-=0.01;
            sx[i]-=random(0,2);
            sy[i]-=random(-1,1);
            if(sx[i]<-10){
                sx[i]=50;
                sy[i]=200;
                
            }
            //rintln(sx[i]+" "+sy[i]);
            ellipse(sx[i],sy[i],20,20);
        }
    }
    //w1=30;
    if(w1>35){
        
        //triangle(50,200,50,225,70,200);
        triangle(50,175,50,200,70,200);
    }else{
        fill(255, 0, 0);
        translate(0,-(y-200));
        rect(0,0,400,50);
        fill(0, 0, 0);
        
        text("WARNING: SHIP IS GOING TO EXPLODE",10,10);
        w1-=0.05;
        translate(0,y-200);
        fill(56,56,56);
        triangle(50,175,50,200,66,200);
        triangle(53,180,66,191,70,204);
        //var sx1=[],sy1=[];
        for(var i=0;i<10;i++){
            sx1[i]-=random(0,2);
            sy1[i]-=random(-1,1);
            if(sx1[i]<-10){
                sx1[i]=50;
                sy1[i]=190;
                
            }
            fill(120);
            //rintln(sx[i]+" "+sy[i]);
            ellipse(sx1[i],sy1[i],20,20);
        }
        //triangle(50,200,50,225,70,200);
    }
    //w2=10;
    //noLoop();
    if(w2>35){
        fill(56);
        triangle(50,200,50,225,70,200);
        //triangle(50,175,50,200,70,200);
    }else{
        fill(255, 0, 0);
        translate(0,-(y-200));
        rect(0,0,400,50);
        fill(0, 0, 0);
        
        text("WARNING: SHIP IS GOING TO EXPLODE",10,10);
        w2-=0.05;
        translate(0,y-200);
        fill(56);
        triangle(51,209,64,216,71,200);
        triangle(55,202,66,191,70,204);
        //var sx1=[],sy1=[];
        for(var i=0;i<10;i++){
            sx2[i]-=random(0,2);
            sy2[i]-=random(-1,1);
            if(sx2[i]<-10){
                sx2[i]=50;
                sy2[i]=210;
                
            }
            fill(120);
            //rintln(sx[i]+" "+sy[i]);
            ellipse(sx2[i],sy2[i],20,20);
        }
        //triangle(50,200,50,225,70,200);
    }

    translate(0,-(y-200));
    fill(140,140,140);
    //triangle(sin(60)*50,cos(60)*50,sin(120)*50,cos(120)*50,sin(180)*50,cos(180)*50);
    //noLoop();
    for(var i=0;i<hma;i++){
        
        xa[i]-=as;
        ellipse(xa[i],ya[i],50,50);
        if(xa[i]<-100){
            xa[i]=460+random(0,90);
            ya[i]=random(y-100,y+100);
        }
        fill(255, 255, 255);
        //h=round(h);
        text(" time: "+frameCount,60,20);
        fill(140, 140, 140);
        if(dist(50,y,xa[i],ya[i])<50){
            //ckground(0);
            //text(h,300,300);
            if(50-abs(ya[i]-y)>25){
                //println("body hit");
                b-=50-abs(ya[i]-y);
            }else{
                if(ya[i]-y<=0){
                    //println("top wing hit");
                    w1-=abs(50-abs(ya[i]-y))*2;
                }else{
                    //println("bottom wing hit");
                    w2-=abs(50-abs(ya[i]-y))*2;
                }
            }
            if(y>ya[i]){
                y=ya[i]+50+random(0,10);
            }else{
                y=ya[i]-50-random(0,10);
            }
            //playSound(getSound("retro/hit2"));
            //text(h,300,300);
            // if(y>ya[i]){//
            //     y+=y-ya[i]
                
            // }else{
            //     y-=dist(50,y,xa[i],ya[i])/2;
                
            // }
            //noLoop();
        }
    }
    if(w1<0||w2<0||b<0){
        noLoop();
        textSize(20);
        //playSound(getSound("retro/boom2"));
        background(0, 0, 0);
        fill(255, 255, 255);
        textAlign(CENTER,CENTER);
        text("you lose\nscore: "+frameCount,200,200);
        if(frameCount>rec){textSize(30);
            text("YOU BEAT MY RECORD!",200,300);
        }
        //h=100;
    }
    }
};

