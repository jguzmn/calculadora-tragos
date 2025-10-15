import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = "https://ergtunwneeemglibqmzc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyZ3R1bnduZWVlbWdsaWJxbXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0OTAyMzMsImV4cCI6MjA3NjA2NjIzM30.SKyMi615aaui2XbDaP5KXNGuyJHuRZltdO65-48-un0";
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

const tabla = document.querySelector("#tablaBotellas tbody");
const btnNueva = document.getElementById("btnNueva");

btnNueva.addEventListener("click", () => {
  window.location.href = "botella-form.html";
});

async function cargarBotellas() {
  const { data, error } = await client.from("botellas").select("*").order("nombre");
  if (error) {
    alert("Error al cargar botellas: " + error.message);
    return;
  }
  renderBotellas(data);
}

function renderBotellas(lista) {
  tabla.innerHTML = "";
  lista.forEach(b => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.nombre}</td>
      <td>${b.pesovacio}</td>
      <td>${b.densidad}</td>
      <td style="text-align:center;">
        <button class="btnEditar" data-id="${b.id}" title="Editar botella">✏️</button>
        <button class="btnEliminar" data-id="${b.id}" title="Eliminar botella">🗑️</button>
      </td>
    `;
    tabla.appendChild(tr);
  });

  document.querySelectorAll(".btnEditar").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      window.location.href = `botella-form.html?id=${id}`;
    });
  });

  document.querySelectorAll(".btnEliminar").forEach(btn => {
    btn.addEventListener("click", async e => {
      const id = e.target.dataset.id;
      if (confirm("¿Seguro que deseas eliminar esta botella?")) {
        const { error } = await client.from("botellas").delete().eq("id", id);
        if (error) alert("Error al eliminar: " + error.message);
        else {
          alert("Botella eliminada correctamente.");
          cargarBotellas();
        }
      }
    });
  });
}

cargarBotellas();