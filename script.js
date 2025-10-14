// === Base de botellas (editable) ===
const botellas = [
  { nombre: "Ron Bacardi", pesoVacio: 950, densidad: 0.98 },
  { nombre: "Whisky Jack", pesoVacio: 980, densidad: 0.96 },
  { nombre: "Tequila Don Julio", pesoVacio: 970, densidad: 0.95 },
];

// === Cargar la lista de botellas ===
const selectBotella = document.getElementById("botella");
botellas.forEach(b => {
  const option = document.createElement("option");
  option.value = b.nombre;
  option.textContent = b.nombre;
  selectBotella.appendChild(option);
});

// === Función para convertir a fracción ===
function convertirFraccion(valor) {
  const entero = Math.floor(valor);
  const fraccion = valor - entero;
  if (fraccion < 0.13) return `${entero}`;
  if (fraccion < 0.38) return `${entero} 1/4`;
  if (fraccion < 0.63) return `${entero} 1/2`;
  if (fraccion < 0.88) return `${entero} 3/4`;
  return `${entero + 1}`;
}

// === Calcular tragos ===
document.getElementById("btnCalcular").addEventListener("click", () => {
  const nombre = selectBotella.value;
  const pesoActual = parseFloat(document.getElementById("pesoActual").value);
  const tamTrago = parseFloat(document.getElementById("tamTrago").value);

  if (!nombre || !pesoActual || !tamTrago) {
    alert("Por favor ingresa todos los campos.");
    return;
  }

  const botella = botellas.find(b => b.nombre === nombre);
  if (!botella) {
    alert("Botella no encontrada en la base.");
    return;
  }

  if (pesoActual < botella.pesoVacio) {
    alert("El peso actual no puede ser menor que el peso vacío.");
    return;
  }

  const pesoLicor = pesoActual - botella.pesoVacio;
  const totalTragos = pesoLicor / (botella.densidad * tamTrago);
  const fraccion = convertirFraccion(totalTragos);

  document.getElementById("pesoLicor").textContent = pesoLicor.toFixed(2);
  document.getElementById("tragosDecimales").textContent = totalTragos.toFixed(2);
  document.getElementById("tragosFraccion").textContent = fraccion;

  // Guardar historial local
  const registro = {
    fecha: new Date().toLocaleString(),
    nombre,
    pesoActual,
    pesoVacio: botella.pesoVacio,
    densidad: botella.densidad,
    tamTrago,
    totalTragos: totalTragos.toFixed(2),
    fraccion
  };

  const historial = JSON.parse(localStorage.getItem("historialTragos") || "[]");
  historial.unshift(registro);
  localStorage.setItem("historialTragos", JSON.stringify(historial));
  renderHistorial();
});

// === Mostrar historial ===
function renderHistorial() {
  const historial = JSON.parse(localStorage.getItem("historialTragos") || "[]");
  const lista = document.getElementById("historial");
  lista.innerHTML = "";
  historial.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `${r.fecha} - ${r.nombre}: ${r.totalTragos} (${r.fraccion})`;
    lista.appendChild(li);
  });
}

renderHistorial();
