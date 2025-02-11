//clases
class Game {
    constructor(){
        this.container = document.getElementById("game-container");
        this.personaje = null;
        this.monedas = [];
        this.puntuacion = 0;
        this.crearEscenario();
        this.agregarEventos();
    }
    crearEscenario(){
        this.personaje = new Personaje();
        this.container.appendChild(this.personaje.element);
        for(let i = 0; i < 5; i++){
            const moneda = new Moneda();
            this.monedas.push(moneda);
            this.container.appendChild(moneda.element);
        }

    }
    agregarEventos(){
        window.addEventListener("keydown", (e) => this.personaje.mover(e));
        this.checkColisiones();
    }
    checkColisiones() {
        // El código dentro de setInterval(100) se ejecutará cada 100 milisegundos, revisando las colisiones constantemente.
      setInterval(() => {
      //este es un array con las monedas del juego, el método forEach recorre el array, el parámetro index nos ayudará a eliminarla después
        this.monedas.forEach((moneda, index) => {
        //colisionaCon() función que verifica si el personaje ha colisionado con la moneda.
          if (this.personaje.colisionaCon(moneda)) {
            // Eliminar moneda en el html y actualizar puntuación
            this.container.removeChild(moneda.element);
            //splice() elimina elementos del array, index dice cual y el 1 dice cuantos
            this.monedas.splice(index, 1);
          }
        });
        
      }, 100);
    }
    }
class Personaje {
    constructor(){
        this.x = 50; //en el eje x se posiciona en los 50px
        this.y = 300;
        this.width = 50;
        this.height = 50;
        this.velocidad = 10; //avanza 10px
        this.saltando = false;
        this.element = document.createElement("div");
        this.element.classList.add("personaje"); //copia los estilos de style.css "personaje"
        this.actualizarPosicion();
    }
    mover(evento) {
        // condicional, Verificamos si la tecla presionada es "ArrowRight"
      if (evento.key === "ArrowRight") {
          //Si el usuario presiona la tecla de flecha derecha, sumamos this.velocidad a this.x, moviendo el personaje a la derecha.
        this.x += this.velocidad;
        //si la tecla es "Arrowleft" restamos this.velocidad a this.x, moviéndolo hacia la izquierda.
      } else if (evento.key === "ArrowLeft") {
        this.x -= this.velocidad;
        //verificamos si es "ArrowUp" y si es así llamamos al método saltar()
      } else if (evento.key === "ArrowUp") {
        this.saltar();
      }
  
          //llamamos a un método que construiremos más adelante
      this.actualizarPosicion();
    }
    saltar(){
        this.saltando = true;
        let alturaMaxima = this.y -100;
        const salto = setInterval(() => {
            if(this.y > alturaMaxima){
                this.y -= 10; //gravedad
            }else {
                clearInterval(salto);
                this.caer();
            }
            this.actualizarPosicion();
        },
            20)

    }
    caer(){
        const gravedad = setInterval(() => {
            if(this.y < 300){
                this.y += 10;
            } else {
                clearInterval(gravedad);
            }
            this.actualizarPosicion();
        },
            20)
    }
    actualizarPosicion(){
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
    colisionaCon(objeto){
        return (
            this.x < objeto.x + objeto.width &&
            this.x + this.width > objeto.x &&
            this.y < objeto.y + objeto.height &&
            this.y + this.height > objeto.y
          );
    }
}
class Moneda {
    constructor(){
        this.x = Math.random() * 700 + 50;
        this.y = Math.random() * 250 + 50;
        this.width = 30;
        this.height = 30;
        this.element = document.createElement("div");
        this.element.classList.add("moneda");
        this.actualizarPosicion();
        }
    actualizarPosicion(){
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}

const juego = new Game();