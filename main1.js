class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.play = document.getElementById("buttonPlay");
        this.personaje = null;
        this.monedas = [];
        this.puntuacion = 0;
        this.teclasPresionadas = {};
        this.isGameOver = false;
        this.puntosElement = document.getElementById("puntos");
        this.messageGameOver = document.getElementById("gameOverMessage");
        this.sonidoColision = new Audio("/audio/me-cago-en_toas_tus_muelas.mp3");
        this.sonidoWin = new Audio("audio/siete_caballos_vienen_de_bonanza_chiquito_de_la_calzada.mp3");
        this.sonidoMoneda = new Audio("audio/chiquito_de_la_calzada_grito.mp3");
        this.sonidoJuego = new Audio("audio/30-seconds-2020-04-24_-_Arcade_Kid_-_FesliyanStudios.com_-_David_Renda.mp3");

        // No iniciar el juego automáticamente, solo configurar el evento para el botón
        this.play.addEventListener("click", () => this.iniciarJuego());
    }

    // Este método es llamado cuando el usuario hace clic en el botón "Play"
    iniciarJuego() {
        // Resetear el estado del juego
        this.puntuacion = 0;
        this.monedas = [];
        this.obstaculos = [];
        this.teclasPresionadas = {};
        this.play.style.display = "none"; // Esconde el botón Play

        // Reproducir la música de fondo
        this.sonidoJuego.play();
        this.sonidoJuego.loop = true;
        this.sonidoJuego.volume = 0.5;

        // Crear el escenario y objetos
        this.crearEscenario();
        this.generarObstaculos();
        this.agregarEventos();
        this.checkColisiones();
    }

    crearEscenario() {
        this.personaje = new Personaje(); // Crear el personaje
        this.container.appendChild(this.personaje.element);

        // Crear las monedas
        for (let i = 0; i < 5; i++) {
            const moneda = new Moneda();
            this.monedas.push(moneda);
            this.container.appendChild(moneda.element);
        }
    }

    agregarEventos() {
        // Controlar las teclas presionadas para mover al personaje
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
                this.personaje.element.style.backgroundImage = "url('img/probarizquierda.png')";
            }
        }

        if ((this.teclasPresionadas["ArrowUp"] || this.teclasPresionadas["Space"]) && !this.personaje.saltando) {
            this.personaje.saltar();
        }

        this.personaje.actualizarPosicion();
    }

    checkColisiones() {
        // Solo comprobar colisiones si el personaje ya está creado
        setInterval(() => {
            if (!this.personaje) return; // Solo ejecuta si el personaje está creado

            // Verificar colisiones con las monedas
            this.monedas.forEach((moneda, index) => {
                if (this.personaje.colisionaCon(moneda)) {
                    this.container.removeChild(moneda.element);
                    this.monedas.splice(index, 1);
                    this.actualizarPuntuacion(10);
                    this.win();
                    this.sonidoMoneda.play();
                }
            });

            // Verificar colisiones con los obstáculos
            this.obstaculos.forEach((obstaculo, index) => {
                if (this.personaje.colisionaCon(obstaculo)) {
                    this.sonidoColision.play();
                    this.sonidoJuego.pause();
                    this.messageGameOver();
                    this.gameOver(); // Solo se ejecuta cuando realmente ocurre una colisión
                }
            });
        }, 100);
    }

    generarObstaculos() {
        // Generar un obstáculo nuevo cada 2 segundos
        setInterval(() => {
            if (!this.personaje) return; // Asegurarse de que el personaje exista
            const obstaculo = new Obstaculo();
            this.obstaculos.push(obstaculo);
            this.container.appendChild(obstaculo.element);
        }, 2000);

        // Mover obstáculos continuamente
        setInterval(() => {
            this.moverObstaculos();
        }, 50);
    }

    actualizarPuntuacion(puntos) {
        this.puntuacion += puntos;
        this.puntosElement.textContent = `Points: ${this.puntuacion}`;
    }
    mostrarMensajeGameOver() {
        // Mostrar el mensaje de "Game Over"
        this.messageGameOver.style.display = "block"; // Muestra el mensaje en pantalla
        this.play.style.display = "block"; // Muestra el botón Play
    }

    gameOver() {
        

        // Mostrar el botón Play para reiniciar el juego
        setTimeout(() => {
            this.play.style.display = "block"; // Mostrar el botón Play
        }, 100);
    }

    win() {
        // Verificar si el jugador ha ganado
        if (this.monedas.length === 0) {
            this.sonidoJuego.pause();
            this.sonidoWin.play();
            alert("¡Has ganado!");

            // Mostrar el botón Play para reiniciar el juego
            this.play.style.display = "block"; // Mostrar el botón Play
        }
    }

    moverObstaculos() {
        // Mover los obstáculos en el escenario
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
        if (juego.isGameOver) return;
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



