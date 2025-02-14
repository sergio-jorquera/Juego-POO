//clases
class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.personaje = null;
        this.monedas = [];
        this.puntuacion = 0;
        this.teclasPresionadas = {};
        this.crearEscenario();
        this.obstaculos = [];
        this.generarObstaculos();
        this.agregarEventos();
        this.checkColisiones();
        this.puntosElement = document.getElementById("puntos");
        this.sonidoColision = new Audio("/audio/me-cago-en-toas-tus-muelas.mp3");
        this.sonidoWin = new Audio ("audio/siete_caballos_vienen_de_bonanza_chiquito_de_la_calzada.mp3");
        this.sonidoMoneda = new Audio ("audio/chiquito_de_la_calzada_grito.mp3");
        this.sonidoJuego = new Audio ("audio/30-seconds-2020-04-24_-_Arcade_Kid_-_FesliyanStudios.com_-_David_Renda.mp3");
        this.sonidoJuego.play(); // Reproduce el sonido cuando el juego comienza
        this.sonidoJuego.loop = true;
        // Si deseas controlar otros aspectos del sonido, puedes configurarlo:
        this.sonidoJuego.volume = 0.5;  // Ajustar el volumen (opcional)
    }


    crearEscenario() {
        this.personaje = new Personaje();
        this.container.appendChild(this.personaje.element);
        for (let i = 0; i < 5; i++) {
            const moneda = new Moneda();
            this.monedas.push(moneda);
            this.container.appendChild(moneda.element);
        }
    }

    agregarEventos() {
        window.addEventListener("keydown", (e) => {
            this.teclasPresionadas[e.code] = true;
            this.actualizarMovimiento();
        });

        window.addEventListener("keyup", (e) => {
            delete this.teclasPresionadas[e.code];
        }); 
    }

    actualizarMovimiento() {
        const anchoContainer = 1015;
        if (this.teclasPresionadas["ArrowRight"]) {
            if (this.personaje.x + this.personaje.width < anchoContainer) {
            this.personaje.x += this.personaje.velocidad;
            this.personaje.element.style.backgroundImage = "url('img/probar.png')";
            }
        }   
        if (this.teclasPresionadas["ArrowLeft"]) {
            if (this.personaje.x > 0) {
            this.personaje.x -= this.personaje.velocidad;
            this.personaje.element.style.backgroundImage = "url('img/probarizquierda.png')"; // Cambia la imagen
            }
        }
        if ((this.teclasPresionadas["ArrowUp"] || this.teclasPresionadas["Space"]) && !this.personaje.saltando) {
            this.personaje.saltar();
        }


        this.personaje.actualizarPosicion();
    }

    checkColisiones() {
        setInterval(() => {
            this.monedas.forEach((moneda, index) => {
                if (this.personaje.colisionaCon(moneda)) {
                    this.container.removeChild(moneda.element);
                    this.monedas.splice(index, 1);
                    this.actualizarPuntuacion(10);
                    this.win();
                    this.sonidoMoneda.play();
                }
            });
            this.obstaculos.forEach((obstaculo, index) => {
                console.log(`Obstáculo ${index}: x=${obstaculo.x}, y=${obstaculo.y}`);
                if (this.personaje.colisionaCon(obstaculo)) {
                    console.log("💥 Colisión detectada con obstáculo");
                    this.sonidoColision.play();
                     this.sonidoJuego.pause(); 
                    this.gameOver(); // Si colisiona con un obstáculo, termina el juego
                }
            });
        }, 100);
    }
    generarObstaculos() {
        // Generar un obstáculo nuevo cada 2 segundos
        setInterval(() => {
            const obstaculo = new Obstaculo();
            this.obstaculos.push(obstaculo);
            this.container.appendChild(obstaculo.element);
        }, 2000);
        setInterval(() => {
            this.moverObstaculos();
        }, 50);
    }

    actualizarPuntuacion(puntos) {
    
        this.puntuacion += puntos;
        this.puntosElement.textContent = ` Points: ${this.puntuacion}`;
    }
    gameOver() {
        alert("Game Over");
        
       
        setTimeout(() => {
            location.reload();
        }, 100); // Espera 100ms antes de recargar
    }
    win() {
        if (this.monedas.length === 0) {
            this.sonidoJuego.pause();
            this.sonidoWin.play();
            alert("¡Has ganado!");
            location.reload(); // Recarga la página
        }
    }
    moverObstaculos() {
        this.obstaculos.forEach((obstaculo) => {
            obstaculo.bajar();
        });
    }
}

class Personaje {
    constructor() {
        this.x = 50;
        this.y = 600;
        this.width = 170;
        this.height = 170;
        this.velocidad = 10;
        this.saltando = false;
        this.element = document.createElement("div");
        this.element.classList.add("personaje");
        this.actualizarPosicion();
    }

    saltar() {
        if (this.saltando) return;
        this.saltando = true;
        let alturaMaxima = this.y - 550;

        const saltar = setInterval(() => {
            if (this.y > alturaMaxima) {
                this.y -= 10;
                if (juego.teclasPresionadas["ArrowRight"] && this.x < 1015 - this.width) {
                    this.x += this.velocidad;
                }
                if (juego.teclasPresionadas["ArrowLeft"] && this.x > 0) {
                    this.x -= this.velocidad;
                }
            } else {
                clearInterval(saltar);
                this.caer();
            }
            this.actualizarPosicion();
        }, 90) ;
    }

    caer() {
        const gravedad = setInterval(() => {
            if (this.y < 600) {
                this.y += 10; 
                if (juego.teclasPresionadas["ArrowRight"] && this.x < 1015 - this.width) {
                    this.x += this.velocidad;
                }
                if (juego.teclasPresionadas["ArrowLeft"] && this.x > 0) {
                    this.x -= this.velocidad;
                }
            } else {
                clearInterval(gravedad);
                this.saltando = false;
            }
            this.actualizarPosicion();
        }, 120);
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    colisionaCon(objeto) {
        const rect1 = this.element.getBoundingClientRect();
        const rect2 = objeto.element.getBoundingClientRect();
    
         const margen = 15; // Ajusta este valor según pruebas, el método getBoundingClientRect hace que la colision sea más exacta
    return !(
        rect1.right - margen < rect2.left + margen ||
        rect1.left + margen > rect2.right - margen ||
        rect1.bottom - margen < rect2.top + margen ||
        rect1.top + margen > rect2.bottom - margen
        );
    }
}
class Objeto {
    constructor(className, x = Math.random() * 700 + 50, y = Math.random() * 250 + 50, width = 30, height = 30) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.element = document.createElement("div");
        this.element.classList.add(className);
        this.actualizarPosicion();
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}
class Moneda extends Objeto {
    constructor() {
        super("moneda");
        this.width = 80;
        this.height =80;    
    }
}
class Obstaculo extends Objeto {
    constructor() {
        super("obstaculo", Math.random() * 700 + 50, -30); // Inicia fuera de la pantalla en Y
        this.velocidad = 5; // Velocidad de caída
        this.width = 90;
        this.height =90;
    }
    bajar() {
        this.y += this.velocidad; // Baja el obstáculo
        this.actualizarPosicion();
        
        if (this.y > 600) { // Si sale de la pantalla
            this.element.remove();
            const index = juego.obstaculos.indexOf(this);
            if (index > -1) {
                juego.obstaculos.splice(index, 1);
            }
        }   
    }
}


const juego = new Game();

this.sonidoJuego.play();

