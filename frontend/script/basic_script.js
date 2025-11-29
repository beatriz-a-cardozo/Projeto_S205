const btnMenu = document.getElementById("botao-menu");
const sidebar = document.getElementById("side-bar");
const overlay = document.getElementById("overlay");
const btnTema = document.getElementById("botao-tema");

btnMenu.addEventListener("click", () => {
    sidebar.classList.add("ativo");
    overlay.classList.add("ativo");
});

overlay.addEventListener("click", () => {
    sidebar.classList.remove("ativo");
    overlay.classList.remove("ativo");
});

function aplicarTema(tema) {
    if (tema === "dark") {
        document.body.classList.add("dark");
        btnTema.checked = true; 
    } else {
        document.body.classList.remove("dark");
        btnTema.checked = false; 
    }
}

btnTema.addEventListener("change", () => {
    const novoTema = btnTema.checked ? "dark" : "light";
    aplicarTema(novoTema);
    localStorage.setItem("tema", novoTema);
});

const temaSalvo = localStorage.getItem("tema") || "light";
aplicarTema(temaSalvo);
