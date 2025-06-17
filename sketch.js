let nuvens = [];
let personagens = [];
let balaoes = [];

function setup() {
  createCanvas(800, 400);
  noStroke();
  textAlign(CENTER);

  for (let i = 0; i < 5; i++) {
    nuvens.push({ x: random(width), y: random(50, 150), speed: random(0.2, 0.5) });
  }

  personagens = [];

  for (let i = 0; i < 10; i++) {
    personagens.push({
      x: 120 + i * 20,
      y: 330 + (i % 3) * 5,
      tipo: "campo",
      dir: random([1, -1]),
      jumpOffset: 0,
      jumping: false,
      jumpStartFrame: 0
    });
  }

  for (let i = 0; i < 10; i++) {
    personagens.push({
      x: 550 + i * 20,
      y: 330 + (i % 3) * 5,
      tipo: "cidade",
      dir: random([1, -1]),
      jumpOffset: 0,
      jumping: false,
      jumpStartFrame: 0
    });
  }

  // Criar balões com posições e velocidades aleatórias
  for (let i = 0; i < 8; i++) {
    balaoes.push({
      x: random(width),
      y: height + random(50, 200),
      speed: random(0.5, 1.5),
      cor: color(random(100, 255), random(100, 255), random(100, 255))
    });
  }
}

function draw() {
  background(20, 30, 70); // Céu noturno azul escuro

  drawCenario();
  drawCampo();
  drawCidade();
  drawNuvens();
  drawLua();
  drawBaloes();

  verificarColisoesEPulos();

  drawPersonagens();

  fill(255); // Texto branco para melhor visibilidade na noite
  textSize(18);
  text("Agrinho 2025 - Festejando a Conexão Campo-Cidade", width / 2, 30);
}

function drawLua() {
  // Lua cheia amarela com sombra para efeito de brilho
  push();
  noStroke();
  fill(255, 255, 200);
  ellipse(width - 100, 80, 70, 70);
  
  // Sombra para dar efeito de cratera
  fill(230, 230, 180);
  ellipse(width - 110, 70, 20, 20);
  ellipse(width - 90, 90, 15, 15);
  ellipse(width - 80, 60, 10, 10);
  pop();
}

function drawBaloes() {
  for (let b of balaoes) {
    // Corpo do balão
    fill(b.cor);
    ellipse(b.x, b.y, 20, 30);
    // Nó do balão
    triangle(b.x - 5, b.y + 10, b.x + 5, b.y + 10, b.x, b.y + 15);
    // Linha do balão
    stroke(150);
    line(b.x, b.y + 15, b.x, b.y + 40);
    noStroke();

    b.y -= b.speed;

    // Quando sai do topo, reinicia embaixo
    if (b.y < -40) {
      b.x = random(width);
      b.y = height + random(50, 200);
      b.speed = random(0.5, 1.5);
      b.cor = color(random(100, 255), random(100, 255), random(100, 255));
    }
  }
}

function verificarColisoesEPulos() {
  for (let p1 of personagens.filter(p => p.tipo === "campo")) {
    for (let p2 of personagens.filter(p => p.tipo === "cidade")) {
      let distancia = abs(p1.x - p2.x);
      if (distancia < 15) {
        if (!p1.jumping && !p2.jumping) {
          p1.jumping = true;
          p2.jumping = true;
          p1.jumpStartFrame = frameCount;
          p2.jumpStartFrame = frameCount;
        }
      }
    }
  }
}

function drawPersonagens() {
  for (let p of personagens) {
    p.x += 0.5 * p.dir;
    if (p.x > width || p.x < 0) {
      p.dir *= -1;
    }

    if (p.jumping) {
      let t = frameCount - p.jumpStartFrame;
      if (t <= 30) {
        p.jumpOffset = -sin((t / 30) * PI) * 20;
      } else {
        p.jumpOffset = 0;
        p.jumping = false;
      }
    }

    drawPersonagem(p.x, p.y + p.jumpOffset, p.tipo);
  }
}

function drawPersonagem(x, y, tipo) {
  if (tipo === "campo") fill(0, 150, 0);
  else fill(0, 0, 200);

  rect(x - 5, y, 10, 15);
  fill(255, 220, 180);
  ellipse(x, y - 5, 10);
}

function drawCenario() {
  fill(100, 180, 100);
  ellipse(width / 4, height + 50, 600, 300);

  fill(160);
  ellipse((3 * width) / 4, height + 50, 600, 300);
}

function drawCampo() {
  let casaX = 130, casaY = 260, casaW = 60, casaH = 40;
  fill(255, 200, 150);
  rect(casaX, casaY, casaW, casaH);

  fill(200, 100, 50);
  triangle(casaX, casaY, casaX + casaW, casaY, casaX + casaW / 2, casaY - 30);

  for (let i = 0; i < 3; i++) {
    let x = 70 + i * 60;
    fill(139, 69, 19);
    rect(x, 290, 10, 30);
    fill(34, 139, 34);
    ellipse(x + 5, 280, 30, 30);
  }

  fill(255, 215, 0);
  for (let i = 50; i < width / 2 - 100; i += 30) {
    ellipse(i, 340 + 5 * sin(i * 0.1 + frameCount * 0.02), 10, 10);
  }
}

function drawCidade() {
  let baseY = height - 50;
  let predios = [
    { x: 580, w: 40, h: 100 },
    { x: 630, w: 50, h: 110 },
    { x: 690, w: 40, h: 90 }
  ];

  for (let p of predios) {
    fill(180, 80, 80);
    rect(p.x, baseY - p.h, p.w, p.h);

    fill(255, 255, 150);
    for (let y = baseY - p.h + 10; y < baseY - 10; y += 25) {
      rect(p.x + 5, y, 10, 15);
      if (p.w >= 40) rect(p.x + p.w - 15, y, 10, 15);
    }
  }

  for (let i = 0; i < 3; i++) {
    let x = 550 + i * 70;
    fill(100);
    rect(x, baseY - 30, 5, 30);
    fill(255, 255, 150);
    ellipse(x + 2.5, baseY - 35, 10, 10);
  }
}

function drawNuvens() {
  fill(255);
  for (let n of nuvens) {
    ellipse(n.x, n.y, 40, 20);
    ellipse(n.x + 15, n.y + 5, 30, 15);
    ellipse(n.x - 15, n.y + 5, 30, 15);

    n.x += n.speed;
    if (n.x > width + 30) n.x = -30;
  }
}
