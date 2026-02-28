const searchInput = document.getElementById('searchInput');
const fromDate = document.getElementById('fromDate');
const toDate = document.getElementById('toDate');
const searchBtn = document.getElementById('searchBtn');
const contentData = document.getElementById('contentData');

searchBtn.addEventListener('click', () => {
    buscarNoticias();
});

const buscarNoticias = async () => {
    const busqueda = searchInput.value.trim();
    const from = fromDate.value;
    const to = toDate.value;

    if (!busqueda) {
        contentData.innerHTML = '<p>Escribe algo para buscar</p>';
        return;
    }
    let url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(busqueda)}&sortBy=popularity&apiKey=a95ae86d76a74b1b88f3baf7773aa8bf`;
    if (from) url += `&from=${from}`;
    if (to) url += `&to=${to}`;
    try {
        const response = await fetch(url);
        console.log("Respuesta:", response); 

        if (!response.ok) {
            throw new Error("Error en la respuesta de la API");
    }
        const data = await response.json();
        console.log("Data:", data);

        contentData.innerHTML  = "<h2 class='mb-3'>Resultados:</h2>";

        if (!data.articles || data.articles.length === 0) {
            contentData.innerHTML += '<p>No se encontraron resultados</p>';
            return;
        }

        data.articles.forEach(article => {
            const divX = document.createElement('div');
            divX.classList.add("col-md-6", 'mb-4');

            const imgHtml = article.urlToImage
        ? `<img src="${article.urlToImage}" class="card-img-top" alt="Imagen de la noticia">`
        : `<img src="https://via.placeholder.com/400x200?text=Sin+imagen" class="card-img-top" alt="Sin imagen">`;

            divX.innerHTML = `
                <div class="card h-100">
                ${imgHtml}
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${article.title || "Sin titulo"}</h5>
                        <p class="card-text">${article.description || "Sin descripcion"}</p>
                        <p class="mb-1">
                        <strong>Fuente:</strong> ${article.source?.name || "Desconocido"}
                        </p>
                        <p class="mb-2">
                        <strong>Fecha:</strong> ${article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "N/A"}
                        </p>
                        <a href="${article.url}" target="_blank" class="btn btn-primary mt-auto">Saber mas</a>
                    </div>
                </div>
            `;
            contentData.appendChild(divX);
        });
    } catch (error) {
        console.error("Error al consultar la API:", error);
        contentData.innerHTML = '<p>Error al consultar la API</p>';
    }
}