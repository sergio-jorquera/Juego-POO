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
        if (this.teclasPresionadas["ArrowRight"]) {
            this.personaje.x += this.personaje.velocidad;
        }
        if (this.teclasPresionadas["ArrowLeft"]) {
            this.personaje.x -= this.personaje.velocidad;
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
                }
            });
            this.obstaculos.forEach((obstaculo, index) => {
                console.log(`Obstáculo ${index}: x=${obstaculo.x}, y=${obstaculo.y}`);
                if (this.personaje.colisionaCon(obstaculo)) {
                    console.log("💥 Colisión detectada con obstáculo");
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
        this.puntosElement.textContent = `${this.puntuacion}`;
    }
    gameOver() {
        alert("Game Over");
        setTimeout(() => {
            location.reload();
        }, 100); // Espera 100ms antes de recargar
    }
    win() {
        if (this.monedas.length === 0) {
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
        this.y = 300;
        this.width = 50;
        this.height = 50;
        this.velocidad = 10;
        this.saltando = false;
        this.element = document.createElement("div");
        this.element.classList.add("personaje");
        this.actualizarPosicion();
    }

    saltar() {
        if (this.saltando) return;
        this.saltando = true;
        let alturaMaxima = this.y - 250;

        const saltar = setInterval(() => {
            if (this.y > alturaMaxima) {
                this.y -= 10;
                if (juego.teclasPresionadas["ArrowRight"]) {
                    this.x += this.velocidad;
                }
                if (juego.teclasPresionadas["ArrowLeft"]) {
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
            if (this.y < 300) {
                this.y += 10; 
                 if (juego.teclasPresionadas["ArrowRight"]) {
                    this.x += this.velocidad;
                }
                if (juego.teclasPresionadas["ArrowLeft"]) {
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
        console.log(`Colisionando: ${this.x}, ${this.y} con ${objeto.x}, ${objeto.y}`);
        return (
            this.x + this.width > objeto.x &&
            this.x < objeto.x + objeto.width &&
            this.y + this.height > objeto.y &&
            this.y < objeto.y + objeto.height
        );
    }
}

class Moneda {
    constructor() {
        this.x = Math.random() * 700 + 50;
        this.y = Math.random() * 250 + 50;
        this.width = 30;
        this.height = 30;
        this.element = document.createElement("div");
        this.element.classList.add("moneda");
        this.actualizarPosicion();
    }

    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}
class Obstaculo {
    constructor() {
        this.x = Math.random() * 700 + 50; // Posición aleatoria en el eje X
        this.y = -30; // Comienza fuera de la pantalla en el eje Y (por encima del área visible)
        this.width = 30; // Tamaño del obstáculo
        this.height = 30;
        this.velocidad = 5; // Velocidad a la que cae
        this.element = document.createElement("div");
        this.element.classList.add("obstaculo"); // Clase CSS para estilos
        this.actualizarPosicion();
    }

    // Mueve el obstáculo hacia abajo
    bajar() {
        this.y += this.velocidad; // Baja el obstáculo
        this.actualizarPosicion();
        this.element.style.left = `${this.x}px`;
         this.element.style.top = `${this.y}px`;
        if (this.y > 500) {
            this.element.remove(); // Elimina del DOM
            const index = juego.obstaculos.indexOf(this);
            if (index > -1) {
                juego.obstaculos.splice(index, 1);
            }
        }   
    }

    // Actualiza la posición del obstáculo en el DOM
    actualizarPosicion() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}

const juego = new Game();