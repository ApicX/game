script.js (FULL FIXED VERSION)

/* ================= CANVAS ================= */
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
/* ================= IMAGES ================= */
const bg = new Image();
bg.src = "assets/background.png";
const pipeImg = new Image();
pipeImg.src = "assets/pipe.png";
let birdImage = new Image();
birdImage.src = "assets/bird1.png";
/* ================= SELECT BIRD ================= */
function selectBird(src){
birdImage.src = src;
}
/* ================= PLAYER ================= */
const player = {
x:120,
y:300,
width:65,
height:65,
velocity:0,
gravity:0.5,
jump:-9
};
/* ================= GAME ================= */
let gameStarted = false;
let score = 0;
let highScore =
localStorage.getItem("highscore") || 0;
let coins =
localStorage.getItem("coins") || 0;
let pipes = [];
let coinObjects = [];
/* ================= START GAME ================= */
document.getElementById("startBtn")
.onclick = ()=>{
document.getElementById("menu")
.style.display = "none";
gameStarted = true;
gameLoop();
};
/* ================= CONTROLS ================= */
function flap(){
if(gameStarted){
player.velocity = player.jump;
}
}
/* TOUCH + CLICK */
canvas.addEventListener("pointerdown", flap);
window.addEventListener("keydown", flap);
/* ================= CREATE PIPE ================= */
function createPipe(){
let gap = 220;
let topHeight =
Math.random() * (canvas.height - 450) + 50;
pipes.push({
x:canvas.width,
width:90,
top:topHeight,
gap:gap,
passed:false
});
/* COINS */
coinObjects.push({
x:canvas.width + 60,
y:topHeight + gap/2,
radius:15,
taken:false
});
}
setInterval(()=>{
if(gameStarted){
createPipe();
}
},1800);
/* ================= DRAW BACKGROUND ================= */
function drawBackground(){
if(bg.complete){
ctx.drawImage(
bg,
0,
0,
canvas.width,
canvas.height
);
}else{
ctx.fillStyle = "#70d6ff";
ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);
}
}
/* ================= DRAW PLAYER ================= */
function drawPlayer(){
if(birdImage.complete){
ctx.drawImage(
birdImage,
player.x,
player.y,
player.width,
player.height
);
}else{
ctx.fillStyle = "yellow";
ctx.fillRect(
player.x,
player.y,
player.width,
player.height
);
}
}
/* ================= DRAW PIPES ================= */
function drawPipes(){
pipes.forEach(pipe=>{
/* IMAGE PIPE */
if(pipeImg.complete){
/* TOP PIPE */
ctx.save();
ctx.translate(
pipe.x + pipe.width/2,
pipe.top/2
);
ctx.rotate(Math.PI);
ctx.drawImage(
pipeImg,
-pipe.width/2,
-pipe.top/2,
pipe.width,
pipe.top
);
ctx.restore();
/* BOTTOM PIPE */
ctx.drawImage(
pipeImg,
pipe.x,
pipe.top + pipe.gap,
pipe.width,
canvas.height
);
}else{
/* FALLBACK PIPE */
ctx.fillStyle = "green";
ctx.fillRect(
pipe.x,
0,
pipe.width,
pipe.top
);
ctx.fillRect(
pipe.x,
pipe.top + pipe.gap,
pipe.width,
canvas.height
);
}
pipe.x -= 4;
/* SCORE */
if(
!pipe.passed &&
pipe.x + pipe.width < player.x
){
pipe.passed = true;
score++;
}
/* COLLISION */
if(
player.x + player.width > pipe.x &&
player.x < pipe.x + pipe.width &&
(
player.y < pipe.top ||
player.y + player.height >
pipe.top + pipe.gap
)
){
endGame();
}
});
}
/* ================= DRAW COINS ================= */
function drawCoins(){
ctx.fillStyle = "gold";
coinObjects.forEach(coin=>{
coin.x -= 4;
if(!coin.taken){
ctx.beginPath();
ctx.arc(
coin.x,
coin.y,
coin.radius,
0,
Math.PI*2
);
ctx.fill();
}
/* COLLISION */
let dx =
(player.x + player.width/2)
- coin.x;
let dy =
(player.y + player.height/2)
- coin.y;
let dist = Math.sqrt(dx*dx + dy*dy);
if(
dist <
coin.radius + player.width/3 &&
!coin.taken
){
coin.taken = true;
coins++;
localStorage.setItem("coins", coins);
}
});
}
/* ================= UPDATE ================= */
function update(){
player.velocity += player.gravity;
player.y += player.velocity;
/* FLOOR */
if(
player.y + player.height >
canvas.height
){
endGame();
}
/* SKY */
if(player.y < 0){
player.y = 0;
}
}
/* ================= DRAW UI ================= */
function drawUI(){
ctx.fillStyle = "white";
ctx.font = "40px Arial";
ctx.fillText(
"Score: " + score,
20,
50
);
ctx.fillText(
"Coins: " + coins,
20,
100
);
ctx.fillText(
"High Score: " + highScore,
20,
150
);
}
/* ================= GAME OVER ================= */
function endGame(){
gameStarted = false;
if(score > highScore){
highScore = score;
localStorage.setItem(
"highscore",
highScore
);
}
document.getElementById("scoreText")
.innerText =
"Score: " + score;
document.getElementById("gameOver")
.style.display = "flex";
}
/* ================= SHOP ================= */
function openShop(){
document.getElementById("shopPanel")
.classList.add("active");
}
function closeShop(){
document.getElementById("shopPanel")
.classList.remove("active");
}
function buyGoldenBird(){
if(coins >= 20){
coins -= 20;
localStorage.setItem(
"coins",
coins
);
alert("Golden Bird Purchased!");
}else{
alert("Not enough coins!");
}
}
/* ================= GAME LOOP ================= */
function gameLoop(){
if(!gameStarted) return;
ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);
/* DEBUG */
console.log("GAME RUNNING");
/* DRAW */
drawBackground();
update();
drawPlayer();
drawPipes();
drawCoins();
drawUI();
requestAnimationFrame(gameLoop);
}
/* ================= RESTART ================= */
function restartGame(){
location.reload();
}
/* ================= RESIZE ================= */
window.addEventListener("resize",()=>{
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
});