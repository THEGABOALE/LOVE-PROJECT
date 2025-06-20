const contenedor = document.getElementById("corazones-container");
const audio = document.getElementById("musica");
const pantallainicial = document.getElementById("pantalla-inicial");
const botoniniciar = document.getElementById("boton-iniciar");
const textoprincipal = document.getElementById("texto-principal");

const totalcorazones = 30;
const separacion = 8; // % mínimo de separación para los corazones
const posiciones = [];

// Función para generar posición horizontal sin que se amontonen
function generarPosicion() {
  let intentos = 0;
  while (intentos < 100) {
    const nuevoleft = Math.random() * 90; // no 100 para no salirse
    const muyCerca = posiciones.some(pos => Math.abs(pos - nuevoleft) < separacion);
    if (!muyCerca) {
      posiciones.push(nuevoleft);
      return nuevoleft;
    }
    intentos++;
  }
  return Math.random() * 90; // si no logra evitar choques lo coloca igual
}

// Crear los corazones con estructura anidada
for (let i = 0; i < totalcorazones; i++) {
  // Contenedor externo: anima el movimiento vertical (flotar)
  const wrapper = document.createElement("div");
  wrapper.className = "corazon-wrapper";

  // Contenedor interno: anima el latido (opcional)
  const corazon = document.createElement("div");
  corazon.className = "corazon";

  // 40% de los corazones con latido suave
  if (Math.random() < 0.4) {
    corazon.classList.add("latido");
  }

  // Posición horizontal aleatoria sin solaparse
  const left = generarPosicion();
  wrapper.style.left = `${left}%`;

  // Configurar duración y delay de la animación
  const duracion = 8000 + Math.random() * 4000;
  const delay = Math.random() * 5;
  wrapper.style.animationDuration = `${duracion}ms`;
  wrapper.style.animationDelay = `${delay}s`;

  // Insertar corazón dentro del wrapper
  wrapper.appendChild(corazon);
  contenedor.appendChild(wrapper);
}

// Función para iniciar música y animación al primer click
function iniciarMusicaYAnimacion() {
  audio.play().catch(() => {
    console.log("Reproducción automática bloqueada, esperando interacción.");
  });
  document.querySelector("h1").classList.add("pulsando");
  // Remover el listener para que sólo se dispare una vez
  document.removeEventListener("click", iniciarMusicaYAnimacion);
}

// Espera a que el usuario haga click para iniciar la música y animación
document.addEventListener("click", iniciarMusicaYAnimacion);
