const publicacoes = [
    "Título da Publicação 1 - Nome da Conferência ou Revista",
    "Título da Publicação 2 - Nome da Conferência ou Revista",
    "Título da Publicação 3 - Nome da Conferência ou Revista",
];

const listaPublicacoes = document.getElementById("lista-publicacoes");
publicacoes.forEach(pub => {
    const li = document.createElement("li");
    li.textContent = pub;
    listaPublicacoes.appendChild(li);
});