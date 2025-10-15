// === Configuración Supabase ===
const SUPABASE_URL = "https://ergtunwneeemglibqmzc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyZ3R1bnduZWVlbWdsaWJxbXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0OTAyMzMsImV4cCI6MjA3NjA2NjIzM30.SKyMi615aaui2XbDaP5KXNGuyJHuRZltdO65-48-un0";
 const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


async function cargarBotellas() {
  const { data, error } = await client.from("botellas").select("*").order("nombre", { ascending: true });
  if (error) {
    alert("Error al cargar botellas: " + error.message);
    return;
  }
  const select = document.getElementById("botella");
  select.innerHTML = "";
  data.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b.nombre;
    opt.textContent = b.nombre;
    opt.dataset.peso = b.pesovacio;
    opt.dataset.densidad = b.densidad;
    select.appendChild(opt);
  });
}

function convertirFraccion(valor) {
  const entero = Math.floor(valor);
  const fr = valor - entero;
  if (fr < 0.13) return `${entero}`;
  if (fr < 0.38) return `${entero} 1/4`;
  if (fr < 0.63) return `${entero} 1/2`;
  if (fr < 0.88) return `${entero} 3/4`;
  return `${entero + 1}`;
}

document.getElementById("btnCalcular").addEventListener("click", () => {
  const sel = document.getElementById("botella");
  const nombre = sel.value;
  const pesovacio = parseFloat(sel.selectedOptions[0].dataset.peso);
  const densidad = parseFloat(sel.selectedOptions[0].dataset.densidad);

  const pesoActual = parseFloat(document.getElementById("pesoActual").value);
  const tamTrago = parseFloat(document.getElementById("tamTrago").value);

  if (!nombre || !pesoActual || !tamTrago) {
    alert("Por favor ingresa todos los campos.");
    return;
  }

  if (pesoActual < pesovacio) {
    alert("El peso actual no puede ser menor que el peso vacío.");
    return;
  }

  const pesoLicor = pesoActual - pesovacio;
  const totalTragos = pesoLicor / (densidad * tamTrago);

  document.getElementById("pesoLicor").textContent = pesoLicor.toFixed(2);
  document.getElementById("tragosDecimales").textContent = totalTragos.toFixed(2);
  document.getElementById("tragosFraccion").textContent = convertirFraccion(totalTragos);
});

cargarBotellas();
