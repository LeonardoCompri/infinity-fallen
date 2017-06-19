/*
 game.js
 Estrutura do jogo
 @author: Leonardo Augusto Compri <leonardocompri46@gmail.com>
 @date: 23/02/2015
 */

/*
 * Proposta do jogo:
 *  Fazer o personagem e o cenário se movimentarem
 * 	Enquanto o jogador move-se no cenário
 *  Obstacúlos viram em sua direção
 */

(function() {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();

//variavel que identifica o estado do game
var STATE = "abertura";
//abertua, creditos, como-jogar, jogando, game-over

//pega aonde será o canvas
var canvas = document.getElementById("canvas"),
//diz o contexto do canvas
ctx = canvas.getContext("2d"),
//Configurações do canvas
//tamanho e largura do canvas
width = 480, height = 320,
//Configurações do player
player = {
	x : width / 2,
	y : height - 70,
	width : 13,
	height : 13,
	speed : 3,
	velX : 0,
	velY : 0,
	jumping : false,
	grounded : false,
	frameX : 0
}, item = {
	width : 20,
	height : 20,
	x : width / 2 - 120,
	y : height - 255,
	visible : true,
	frameX : 0
}

enemy0 = {
	width : 13,
	height : 13,
	x : width / 2 - 80,
	y : 68,
	direcao : "e", //"e" = Esquerda "d" = Direita
	limiteEsquerda : 60,
	limiteDireita : 300,
	ativo : 1,
	frameX : 0
}

enemy1 = {
	width : 13,
	height : 13,
	x : width / 2 - 30,
	y : height - 60,
	direcao : "e", //"e" = Esquerda "d" = Direita
	limiteEsquerda : 130,
	limiteDireita : 300,
	ativo : 0,
	frameX : 0
}

enemy2 = {
	width : 13,
	height : 13,
	x : width / 2 + 220,
	y : height - 175,
	direcao : "e", //"e" = Esquerda "d" = Direita
	limiteEsquerda : 400,
	limiteDireita : 460,
	ativo : 0,
	frameX : 0
}

keys = [];

var toqueNaTela = {
	x: 0,
	y: 0
}

friction = 0.8, gravity = 0.1;
PONTUACAO = 0;

var boxes = []

// dimensions
//caixa da esqueda/canto esquerdo
boxes.push({
	x : 0,
	y : 0,
	width : 1,
	height : height
});
//caixa de cima/superior
boxes.push({
	x : 0,
	y : 0,
	width : width,
	height : 1
});
//caixa da direita/canto direito
boxes.push({
	x : width - 1,
	y : 0,
	width : 1,
	height : height
});
//Caixa central
boxes.push({
	x : 65,
	y : 80,
	width : 255,
	height : 110
});
//caixa de baixo
boxes.push({
	x : 129,
	y : 273,
	width : 189,
	height : 45
});
//caixa do lado direito
boxes.push({
	x : 405,
	y : 157,
	width : 75,
	height : 35
});
//caixa do lado direito parte de baixo
boxes.push({
	x : 445,
	y : 305,
	width : 40,
	height : 20
});

/*============================
Carregando as imagens
============================*/

// ---[ Imagem de fundo ]--- //
// Para saber se a imagem foi carregada
var bgImageReady = false;
var bgImage = new Image();
// Cria uma imagem
// Informa quando a imagem está carregada
bgImage.onload = function() {
	bgImageReady = true;
};
// Informa qual imagem carregar
bgImage.src = "imagens/background-image.jpg";

// ---[ Herói ]--- //
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function() {
	heroReady = true;
};
heroImage.src = "imagens/hero_sprite.png";

// ---[ Monstro ]--- //
var enemyReady = false;
var enemyImage = new Image();
enemyImage.onload = function() {
	enemyReady = true;
};
enemyImage.src = "imagens/monster_sprite.png";

// ---[ Item ]--- //
var coinReady = false;
var coinImage = new Image();
coinImage.onload = function() {
	coinReady = true;
};
coinImage.src = "imagens/coin_sprite.png";

// ---[ Abertura ]--- //
var initReady = false;
var initImage = new Image();
initImage.onload = function() {
	initReady = true;
};
initImage.src = "imagens/tela-init.png";

// ---[ Game-Over ]--- //
var goReady = false;
var goImage = new Image();
goImage.onload = function() {
	goReady = true;
};
goImage.src = "imagens/tela-game-over.png";

// ---[ How to play ]--- //
var howReady = false;
var howImage = new Image();
howImage.onload = function() {
	howReady = true;
};
howImage.src = "imagens/tela-how-to-play.png";

// ---[ Credits ]--- //
var creditsReady = false;
var creditsImage = new Image();
creditsImage.onload = function() {
	creditsReady = true;
};
creditsImage.src = "imagens/tela-credits.png";

//responde ao click da tela
canvas.addEventListener( "touchstart", checkClick );
	
//responde ao click do mouse
canvas.addEventListener( "click", checkClick );

//Configura o canvas com o tamanho desejado
canvas.width = width;
canvas.height = height;

function update() {
	switch(STATE) {
	case "abertura":
		render();
		break;
	case "creditos":
		render();
		break;
	case "como-jogar":
		render();
		break;
	case "jogando":
		// check keys
		if (keys[38] || keys[32]) {
			// up arrow or space
			if (!player.jumping && player.grounded) {
				player.jumping = true;
				player.grounded = false;
				player.velY = -player.speed * 2;
			}
		}

		if (keys[39]) {
			// right arrow
			if (player.velX < player.speed) {
				player.velX++;
			}
			player.frameX = 0;
		}
		if (keys[37]) {
			// left arrow
			if (player.velX > -player.speed) {
				player.velX--;
			}
			player.frameX = 1;
		}

		render();

		if (item.frameX < 9) {
			item.frameX++;
		} else if (item.frameX == 9) {
			item.frameX = 0;
		}

		if (colCheckItem(player, item)) {
			//alert("PEGOU!");
			item.visible = false;
			PONTUACAO++;
		}

		if (item.visible == false) {
			getRandomItem();
			//	alert(item.x);
			item.visible = true;
		}

		player.velX *= friction;
		player.velY += gravity;

		player.grounded = false;
		for (var i = 0; i < boxes.length; i++) {
			ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

			var dir = colCheck(player, boxes[i]);

			if (dir === "l" || dir === "r") {
				player.velX = 0;
				player.jumping = false;
			} else if (dir === "b") {
				player.grounded = true;
				player.jumping = false;
			} else if (dir === "t") {
				player.velY *= -1;
			}

		}

		if (player.grounded) {
			player.velY = 0;
		}

		player.x += player.velX;
		player.y += player.velY;

		if (player.y > canvas.height) {
			player.y = 3;
		}

		//array de inimigos
		var inimigo = [enemy0, enemy1, enemy2];

		//função que movimenta os inimigos
		enemyMoving(inimigo);

		//função que verifica se a colisão entre o player e o inimigo
		colisaoInimigo(inimigo);
		break;
	//jogando

	case "game-over":
		render();
		break;
	}

	requestAnimationFrame(update);
}

document.body.addEventListener("keydown", function(e) {
	keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
	keys[e.keyCode] = false;
});

function render() {
	
	ctx.clearRect(0, 0, width, height);
	
	switch(STATE) {
	case "abertura":
		// ---[ Imagem de Fundo ]--- //
		if (initReady == true) {
			// Imagem na posição X e Y
			ctx.drawImage(initImage, 0, 0);
		}// FIM if
		break;
	case "creditos":
		// ---[ Imagem de Fundo ]--- //
		if (creditsReady == true) {
			// Imagem na posição X e Y
			ctx.drawImage(creditsImage, 0, 0);
		}// FIM if
		break;
	case "como-jogar":
		// ---[ Imagem de Fundo ]--- //
		if (howReady == true) {
			// Imagem na posição X e Y
			ctx.drawImage(howImage, 0, 0);
		}// FIM if
		break;
	case "jogando":
		// ---[ Imagem de Fundo ]--- //
		if (bgImageReady == true) {
			// Imagem na posição X e Y
			ctx.drawImage(bgImage, 0, 0);
		}// FIM if

		//desenha o personagem
		//ctx.fillStyle = "red";
		//ctx.fillRect(player.x, player.y, player.width, player.height);

		// ---[ Herói ]--- //
		if (heroReady == true) {
			ctx.drawImage(heroImage, player.frameX * player.width, 0, // X e Y dentro da imagem
			player.width, player.height, // largura e altura da imagem original
			player.x, player.y, // posição X e Y na tela (canvas)
			13, 13);// tamanho da imagem que aparece no canvas
		}// FIM if

		//desenha o item no cenário
		if (item.visible == true) {
			// ---[ Item ]--- //
			if (coinReady == true) {
				ctx.drawImage(coinImage, item.frameX * item.width, 0, // X e Y dentro da imagem
				item.width, item.height, // largura e altura da imagem original
				item.x, item.y, // posição X e Y na tela (canvas)
				15, 15);
				// tamanho da imagem que aparece no canvas
			} // FIM if
		}

		ctx.fillStyle = "transparent";
		ctx.beginPath();

		for (var i = 0; i < boxes.length; i++) {
			ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);
		}

		ctx.fill();

		//desenha a pontuação
		if (coinReady == true) {
			ctx.drawImage(coinImage, 0, 0, // X e Y dentro da imagem
			item.width, item.height, // largura e altura da imagem original
			420, 5, // posição X e Y na tela (canvas)
			15, 15);
			// tamanho da imagem que aparece no canvas
		}// FIM if
		//determina quando desenhar o inimigo
		if (PONTUACAO >= 0 && PONTUACAO < 3) {
			// ---[ Monstro ]--- //
			if (enemyReady == true) {
				ctx.drawImage(enemyImage, enemy0.frameX * enemy0.width, 0, // X e Y dentro da imagem
				enemy0.width, enemy0.height, // largura e altura da imagem original
				enemy0.x, enemy0.y, // posição X e Y na tela (canvas)
				13, 13);
				// tamanho da imagem que aparece no canvas
			} // F13IM if

		} else if (PONTUACAO >= 3 && PONTUACAO < 5) {
			// ---[ Monstro ]--- //
			if (enemyReady == true) {
				ctx.drawImage(enemyImage, enemy0.frameX * enemy0.width, 0, // X e Y dentro da imagem
				enemy0.width, enemy0.height, // largura e altura da imagem original
				enemy0.x, enemy0.y, // posição X e Y na tela (canvas)
				13, 13);
				// tamanho da imagem que aparece no canvas
			}// FIM if

			enemy1.ativo = 1;
			// ---[ Monstro ]--- //
			if (enemyReady == true) {
				ctx.drawImage(enemyImage, enemy1.frameX * enemy1.width, 0, // X e Y dentro da imagem
				enemy1.width, enemy1.height, // largura e altura da imagem original
				enemy1.x, enemy1.y, // posição X e Y na tela (canvas)
				13, 13);
				// tamanho da imagem que aparece no canvas
			} // FIM if
		} else if (PONTUACAO >= 5 && PONTUACAO < 100) {
			// ---[ Monstro ]--- //
			if (enemyReady == true) {
				ctx.drawImage(enemyImage, enemy0.frameX * enemy0.width, 0, // X e Y dentro da imagem
				enemy0.width, enemy0.height, // largura e altura da imagem original
				enemy0.x, enemy0.y, // posição X e Y na tela (canvas)
				13, 13);
				// tamanho da imagem que aparece no canvas
			}// FIM if

			enemy1.ativo = 1;
			// ---[ Monstro ]--- //
			if (enemyReady == true) {
				ctx.drawImage(enemyImage, enemy1.frameX * enemy1.width, 0, // X e Y dentro da imagem
				enemy1.width, enemy1.height, // largura e altura da imagem original
				enemy1.x, enemy1.y, // posição X e Y na tela (canvas)
				13, 13);
				// tamanho da imagem que aparece no canvas
			}// FIM if

			enemy2.ativo = 1;
			// ---[ Monstro ]--- //
			if (enemyReady == true) {
				ctx.drawImage(enemyImage, enemy2.frameX * enemy2.width, 0, // X e Y dentro da imagem
				enemy2.width, enemy2.height, // largura e altura da imagem original
				enemy2.x, enemy2.y, // posição X e Y na tela (canvas)
				13, 13);
				// tamanho da imagem que aparece no canvas
			} // FIM if
		}

		//escreve a pontuação
		ctx.font = '17px arial';
		ctx.fillStyle = "#000000";
		ctx.textBaseline = 'top';
		ctx.fillText(PONTUACAO, 445, 7);
		break;//jogando
	case "game-over":
		if (goReady == true) {
			ctx.drawImage(goImage, 0, 0, // X e Y dentro da imagem
			480, 320, // largura e altura da imagem original
			0, 0, // posição X e Y na tela (canvas)
			480, 320);// tamanho da imagem que aparece no canvas
		}// FIM if
		
		//escreve a pontuação
		ctx.font = '25px arial';
		ctx.fillStyle = "#ffffff";
		ctx.textBaseline = 'top';
		ctx.fillText(PONTUACAO, canvas.width / 2 + 50, canvas.height / 2 + 50);
		break;
	}//fim case
}

window.addEventListener("load", function() {
	update();
});

function colCheck(shapeA, shapeB) {
	// get the vectors to check against
	var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)), vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
	// add the half widths and half heights of the objects
	hWidths = (shapeA.width / 2) + (shapeB.width / 2), hHeights = (shapeA.height / 2) + (shapeB.height / 2), colDir = null;

	// if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
	if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {// figures out on which side we are colliding (top, bottom, left, or right)         var oX = hWidths - Math.abs(vX),             oY = hHeights - Math.abs(vY);         if (oX >= oY) {

		var oX = hWidths - Math.abs(vX), oY = hHeights - Math.abs(vY);

		if (oX >= oY) {
			if (vY > 0) {
				colDir = "t";
				shapeA.y += oY;
			} else {
				colDir = "b";
				shapeA.y -= oY;
			}
		} else {
			if (vX > 0) {
				colDir = "l";
				shapeA.x += oX;
			} else {
				colDir = "r";
				shapeA.x -= oX;
			}
		}
	}
	return colDir;
}

function colCheckItem(shapeA, shapeB) {
	// get the vectors to check against
	var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)), vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
	// add the half widths and half heights of the objects
	hWidths = (shapeA.width / 2) + (shapeB.width / 2), hHeights = (shapeA.height / 2) + (shapeB.height / 2), colDir = null;

	// if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
	if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {// figures out on which side we are colliding (top, bottom, left, or right)         var oX = hWidths - Math.abs(vX),             oY = hHeights - Math.abs(vY);         if (oX >= oY) {
		return true;
	} else {
		return false;
	}
}

function colCheckEnemy(shapeA, shapeB) {
	// get the vectors to check against
	var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)), vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
	// add the half widths and half heights of the objects
	hWidths = (shapeA.width / 2) + (shapeB.width / 2), hHeights = (shapeA.height / 2) + (shapeB.height / 2), colDir = null;

	// if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
	if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {// figures out on which side we are colliding (top, bottom, left, or right)         var oX = hWidths - Math.abs(vX),             oY = hHeights - Math.abs(vY);         if (oX >= oY) {
		return true;
	} else {
		return false;
	}
}

function colisaoInimigo(inimigo) {
	for (var i = 0; i < 3; i++) {
		if (colCheckEnemy(player, inimigo[i]) && inimigo[i].ativo == 1) {
			//alert("MORREU!!!");
			STATE = "game-over";
			
			player.x = width / 2;
			player.y = height - 70;
			
			item.x = width / 2 - 120;
			item.y = height - 255;
			
			enemy0.x = width / 2 - 80;
			enemy0.y = 68;
			
			enemy1.x = width / 2 - 30;
			enemy1.y = height - 60;
			enemy2.ativo = 0;
			
			enemy2.x = width / 2 + 220;
			enemy2.y = height - 175;
			enemy2.ativo = 0;
			
		}
	}
}

function getRandomItem() {
	item.x = Math.floor((Math.random() * 400) + 100);

	item.y = Math.floor((Math.random() * 250) + 32);

	for (var i = 0; i < boxes.length; i++) {
		if (colCheckItem(item, boxes[i])) {
			getRandomItem();
		}
	}
}

function enemyMoving(inimigo) {
	for (var i = 0; i < 3; i++) {
		if (inimigo[i].x < inimigo[i].limiteDireita && inimigo[i].direcao == "d") {
			inimigo[i].x += 1;
			inimigo[i].frameX = 0;
		} else {
			inimigo[i].direcao = "e";
		}
		if (inimigo[i].x > inimigo[i].limiteEsquerda && inimigo[i].direcao == "e") {
			inimigo[i].x -= 1;
			inimigo[i].frameX = 1;
		} else {
			inimigo[i].direcao = "d";
		}
	}

}

function checkClick( e ){
	// Evita comportamento padrão
	e.preventDefault();
	
	
	// Exibe X e Y de UM toque na página
	// alert( toques[0].pageX + ", " + toques[0].pageY );
	if( e.type == "touchstart" ){
		toqueNaTela.x = e.targetTouches[0].pageX - parseInt( canvas.offsetLeft );
		toqueNaTela.y = e.targetTouches[0].pageY - parseInt( canvas.offsetTop );
	}else{
		toqueNaTela.x = e.pageX - parseInt( canvas.offsetLeft );
		toqueNaTela.y = e.pageY - parseInt( canvas.offsetTop );	
	}
	
	
	var proporcao = 1; //parseInt( canvas.style.width ) / 480;
	
	
			
	switch(STATE){
		case "abertura":
			//verificando o click no botão play
			if(
			( ( toqueNaTela.x >= 208 * proporcao )
			  &&
			  ( toqueNaTela.y >= 182 * proporcao ) )
			  &&
			( ( toqueNaTela.x <= ( 208 + 88 ) * proporcao )
			  &&
			  ( toqueNaTela.y <= ( 182 + 48 ) * proporcao ) )
		  ) {
				// Faz alguma coisa
				STATE = "jogando";
			 }
			
			//verifica se o botão how to play foi clicado
			if(
			( ( toqueNaTela.x >= 45 * proporcao )
			  &&
			  ( toqueNaTela.y >= 248 * proporcao ) )
			  &&
			( ( toqueNaTela.x <= ( 45 + 154 ) * proporcao )
			  &&
			  ( toqueNaTela.y <= ( 248 + 41 ) * proporcao ) )
		  ) {
				// Faz alguma coisa
				STATE = "como-jogar";
			 } 
			 
			 //verifica se o botão credits foi clicado
			 if(
			( ( toqueNaTela.x >= 307 * proporcao )
			  &&
			  ( toqueNaTela.y >= 249 * proporcao ) )
			  &&
			( ( toqueNaTela.x <= ( 307 + 106 ) * proporcao )
			  &&
			  ( toqueNaTela.y <= ( 249 + 42 ) * proporcao ) )
		  ) {
				// Faz alguma coisa
				STATE = "creditos";
			 } 
			break;
		case "como-jogar":
			//verifica se o botão back foi clicado
			 if(
			( ( toqueNaTela.x >= 373 * proporcao )
			  &&
			  ( toqueNaTela.y >= 259 * proporcao ) )
			  &&
			( ( toqueNaTela.x <= ( 373 + 74 ) * proporcao )
			  &&
			  ( toqueNaTela.y <= ( 259 + 38 ) * proporcao ) )
		 	) {
				// Faz alguma coisa
				STATE = "abertura";
			 } 
			break;
		case "creditos":
			//verifica se o botão back foi clicado
			 if(
			( ( toqueNaTela.x >= 373 * proporcao )
			  &&
			  ( toqueNaTela.y >= 259 * proporcao ) )
			  &&
			( ( toqueNaTela.x <= ( 373 + 74 ) * proporcao )
			  &&
			  ( toqueNaTela.y <= ( 259 + 38 ) * proporcao ) )
		 	) {
				// Faz alguma coisa
				STATE = "abertura";
			 } 
			break;
		case "jogando":
		
			break;
		case "game-over":
			//verifica se o botão back foi clicado
			 if(
			( ( toqueNaTela.x >= 29 * proporcao )
			  &&
			  ( toqueNaTela.y >= 262 * proporcao ) )
			  &&
			( ( toqueNaTela.x <= ( 26 + 106 ) * proporcao )
			  &&
			  ( toqueNaTela.y <= ( 262 + 34 ) * proporcao ) )
		 	) {
				// Faz alguma coisa
				STATE = "jogando";
				PONTUACAO = 0;
			 } 
			
			//verifica se o botão back foi clicado
			 if(
			( ( toqueNaTela.x >= 373 * proporcao )
			  &&
			  ( toqueNaTela.y >= 259 * proporcao ) )
			  &&
			( ( toqueNaTela.x <= ( 373 + 74 ) * proporcao )
			  &&
			  ( toqueNaTela.y <= ( 259 + 38 ) * proporcao ) )
		 	) {
				// Faz alguma coisa
				STATE = "abertura";
				PONTUACAO = 0;
			 } 
			break;
	}
}

