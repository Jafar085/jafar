var mobilmi = false;

(function(a) {
    if (/android|bb\d+|meego|mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge|maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm(os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a.substr(0, 4))) {
        mobilmi = true;
    }
})(navigator.userAgent || navigator.vendor || window.opera);

console.log(mobilmi);

var c = document.createElement("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.appendChild(c);
var ctx = c.getContext("2d");

var pts = [];
while (pts.length < 254) {
    var val = Math.floor(Math.random() * 255);
    if (!pts.includes(val)) {
        pts.push(val);
    }
}
pts.push(pts[0]);

var lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2;

var noise = x => {
    x = x * 0.01 % 254;
    return lerp(pts[Math.floor(x)], pts[Math.ceil(x)], x - Math.floor(x));
}

var truck = new Image();
truck.src = "truck.png";
var startBtn = new Image();
startBtn.src = "basla.png";

var bgcolor = "blue";
var forecolor = "#4a3f35";
var linecolor = "#2f2519";
var linewidth = 5;
var offset = -10;
var yRatio = 0.4;
var t = 0;
var speed = 0;
var playing = true;
var score = 0; 

var player = {
    x: c.width / 2,
    y: 50,
    rot: 0,
    ySpeed: 0,
    rSpeed: 0,

    draw: function() {
        var p1 = (c.height * 0.9) - noise(this.x + t) * yRatio;
        var p2 = (c.height * 0.9) - noise(this.x + t + 5) * yRatio;
        var gnd = 0;
        var offset = 38;
        if (p1 - offset > this.y) {
            this.ySpeed += 0.1;
        } else {
            this.ySpeed -= this.y - (p1 - offset);
            this.y = p1 - offset;
            gnd = 1;
        }
        if (!playing || (gnd && Math.abs(this.rot) > Math.PI * 0.5)) {
            playing = false;
            this.rSpeed = 5;
            this.x -= speed * 5;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "32px Impact";
            ctx.fillStyle = "white";
            ctx.fillText("OYUN BİTTİ", c.width / 2, c.height / 3);
            ctx.drawImage(startBtn, (c.width / 2) - 25, (c.height / 3) + 50, 50, 50);
        }
        var angle = Math.atan2((p2 - offset) - this.y, (this.x + 5) - this.x);
        if (gnd && playing) {
            this.rot -= (this.rot - angle) * 0.1; 
            this.rSpeed = this.rSpeed - (angle - this.rot);
        }
        this.rot -= this.rSpeed * 0.1;
        if (this.rot > Math.PI) this.rot = -Math.PI;
        if (this.rot < -Math.PI) this.rot = Math.PI;
        this.y += this.ySpeed;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(truck, -40, -40, 80, 80);
        ctx.restore();
    }
};

function draw() {
    speed -= (speed - 1) * 0.01;
    t += 5 * speed;
    ctx.fillStyle = bgcolor;
    ctx.fillRect(0, 0, c.width, c.height);
    player.draw();
    ctx.fillStyle = forecolor;
    ctx.strokeStyle = linecolor;
    ctx.lineWidth = linewidth;
    ctx.beginPath();
    ctx.moveTo(offset, c.height - offset);
    for (let i = offset; i < c.width - offset; ++i) {
        ctx.lineTo(i, (c.height * 0.9) - noise(i + t) * yRatio);
    }
    ctx.lineTo(c.width - offset, c.height - offset);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    
    if (playing) {
        score += 1;
    }
    
    
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center"; 
    ctx.fillText("Skor: " + score, c.width / 2, 30); 
    
    requestAnimationFrame(draw);
}
draw();


document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
        
        player.rot -= 0.3; 
    } else if (event.key === "ArrowRight") {
       
        player.rot += 0.3; 
    }
});


c.addEventListener("touchstart", handleStart, false);
c.addEventListener("touchend", handleEnd, false);

function handleStart(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        var touch = touches[i];
        if (touch.pageX > ((c.width / 2) - 25) && touch.pageX < ((c.width / 2) + 25) && touch.pageY > ((c.height / 3) + 50) && touch.pageY < ((c.height / 3) + 100)) {
            resetGame();
        }
    }
}

function handleEnd(evt) {
    evt.preventDefault();
}

function resetGame() {
    t = Math.random() * 1000; 
    speed = 0;
    playing = true;
    score = 0; 
    player.x = c.width / 2;
    player.y = 50;
    player.rot = 0;
    player.ySpeed = 0;
    player.rSpeed = 0;
}
