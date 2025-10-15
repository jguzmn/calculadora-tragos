import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = "https://ergtunwneeemglibqmzc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyZ3R1bnduZWVlbWdsaWJxbXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0OTAyMzMsImV4cCI6MjA3NjA2NjIzM30.SKyMi615aaui2XbDaP5KXNGuyJHuRZltdO65-48-un0";
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const titulo = document.getElementById("titulo");
const nombre = document.getElementById("nombre");
const pesovacio = document.getElementById("pesovacio");
const densidad = document.getElementById("densidad");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

// Si hay id, cargar datos existentes
if (id) {
  titulo.textContent = "Editar Botella";
  cargarBotella();
}

async function cargarBotella() {
  const { data, error } = await client.from("botellas").select("*").eq("id", id).single();
  if (error) {
    alert("Error al cargar botella: " + error.message);
    return;
  }
  nombre.value = data.nombre;
  pesovacio.value = data.pesovacio;
  densidad.value = data.densidad;
}

btnGuardar.addEventListener("click", async () => {
  const datos = {
    nombre: nombre.value.trim(),
    pesovacio: parseFloat(pesovacio.value),
    densidad: parseFloat(densidad.value)
  };

  if (!datos.nombre || !datos.pesovacio || !datos.densidad) {
    alert("Por favor completa todos los campos.");
    return;
  }

  let query;
  if (id) query = client.from("botellas").update(datos).eq("id", id);
  else query = client.from("botellas").insert([datos]);

  const { error } = await query;
  if (error) alert("Error al guardar: " + error.message);
  else {
    alert("Botella guardada correctamente.");
    window.location.href = "botellas.html";
  }
});

btnCancelar.addEventListener("click", () => {
  window.location.href = "botellas.html";
});
