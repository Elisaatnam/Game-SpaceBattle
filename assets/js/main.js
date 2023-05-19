let canvas;
let ctx;
let bgImg = new Image();

let keySpace = false; //32
let keyUp = false; //38
let keyDown = false; //40

let rocket = {
	x: 50,
	y: 200,
	width: 100,
	height: 50,
	src: "../assets/img/rocket.png",
};

let ufos = []; //leeres Array, wo dann durch die Funktion createUfos alle 5 sekunden ein neues ufo reingepushed wird

let shots = []; //leeres Array, wo durch druecken der Leertaste ein Shot reingepushed wird

document.onkeydown = function (e) {
	if (e.keyCode == 32) {
		keySpace = true;
	}
	if (e.keyCode == 38) {
		keyUp = true;
	}
	if (e.keyCode == 40) {
		keyDown = true;
	}
};

document.onkeyup = function (e) {
	if (e.keyCode == 32) {
		keySpace = false;
	}
	if (e.keyCode == 38) {
		keyUp = false;
	}
	if (e.keyCode == 40) {
		keyDown = false;
	}
};

function startGame() {
	canvas = document.querySelector("canvas");
	ctx = canvas.getContext("2d");
	loadImgs();
	setInterval(update, 1000 / 25);
	setInterval(createUfos, 5000);
	setInterval(checkForCollision, 1000 / 25);
	setInterval(checkForShoot, 1000 / 10);
	draw();
}

function checkForCollision() {
	ufos.forEach(function (ufo) {
		// Kontrollieren, ob UFO mit Rakete kollidiert
		if (
			rocket.x + rocket.width > ufo.x &&
			rocket.y + rocket.height > ufo.y &&
			rocket.x < ufo.x &&
			rocket.y < ufo.y + ufo.height
		) {
			rocket.img.src = "../assets/img/explosion.png";
			ufos = ufos.filter(u => u != ufo);
		}

		shots.forEach(function (shot) {
			// Kontrollieren, ob Laser mit Rakete kollidiert
			if (
				shot.x + shot.width > ufo.x &&
				shot.y + shot.height > ufo.y &&
				shot.x < ufo.x &&
				shot.y < ufo.y + ufo.height
			) {
				ufo.hit = true;
				ufo.img.src = "../assets/img/explosion.png";

				setTimeout(() => {
					ufos = ufos.filter(u => u != ufo);
				}, 2000);
			}
		});
	});
}

function createUfos() {
	let ufo = {
		x: 800,
		y: Math.floor(Math.random() * (canvas.height - 40)), // Zufällige y-Position generieren
		width: 100,
		height: 40,
		src: "../assets/img/ufo.png",
		img: new Image(),
	};

	ufo.img.src = ufo.src; //Ufo Bild wird geladen
	ufos.push(ufo);
}

function checkForShoot() {
	if (keySpace) {
		let shot = {
			x: rocket.x + 110,
			y: rocket.y + 22,
			width: 20,
			height: 4,
			src: "../assets/img/shot.png ",
			img: new Image(),
		};
		shot.img.src = shot.src; // Laser-Bild wird geladen.

		shots.push(shot);
	}
}

function update() {
	if (keyUp) {
		rocket.y -= 4;
	}
	if (keyDown) {
		rocket.y += 4;
	}

	ufos.forEach(function (ufo) {
		if (!ufo.hit) {
			ufo.x -= 5;
		}
	});

	shots.forEach(function (shot) {
		shot.x += 15;
	});
}

function loadImgs() {
	bgImg.src = "../assets/img/bg2.jpg";

	rocket.img = new Image();
	rocket.img.src = rocket.src;
}

function draw() {
	ctx.drawImage(bgImg, 0, 0);
	ctx.drawImage(rocket.img, rocket.x, rocket.y, rocket.width, rocket.height);

	ufos.forEach(function (ufo) {
		ctx.drawImage(ufo.img, ufo.x, ufo.y, ufo.width, ufo.height);
	});

	shots.forEach(function (shot) {
		ctx.drawImage(shot.img, shot.x, shot.y, shot.width, shot.height);
	});

	requestAnimationFrame(draw);
}
