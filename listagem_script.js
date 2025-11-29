const lista = document.getElementById("lista");

const filtroStatus = document.getElementById("filtro-status");
const filtroDuracao = document.getElementById("filtro-duracao");
const filtroIdioma = document.getElementById("filtro-idioma");
const filtroUniversidade = document.getElementById("filtro-universidade");
const filtroDupGraduacao = document.getElementById("filtro-dupla-graduacao");
const filtroPais = document.getElementById("filtro-pais");

let editais = [];

fetch("editais.json")
    .then(r => r.json())
    .then(json => {
        editais = json;
        preencherFiltros(editais);
        aplicarFiltros();
    })
    .catch(err => console.error("Erro ao carregar editais json", err));


function formatarDuracao(meses) {
    if (meses === 1) return "1 mês";
    if (meses === 12) return "1 ano";

    if (meses > 12) {
        const anos = Math.floor(meses / 12);
        const resto = meses % 12;

        if (resto === 0)
            return anos + (anos > 1 ? " anos" : " ano");

        return `${anos}${anos > 1 ? " anos" : " ano"} e ${resto}${resto > 1 ? " meses" : " mês"}`;
    }

    return meses + " meses";
}

function preencherFiltros(data) {
    const idiomasSet = new Set();
    const paisSet = new Set();
    const duracaoSet = new Set();
    const universidadeSet = new Set();

    data.forEach(e => {
        e.idioma.forEach(i => idiomasSet.add(i));
        paisSet.add(e.pais);
        duracaoSet.add(e.duracao);
        universidadeSet.add(e.universidade);
    });

    filtroIdioma.innerHTML = `<option value="">Todos</option>`;
    filtroPais.innerHTML = `<option value="">Todos</option>`;
    filtroUniversidade.innerHTML = `<option value="">Todos</option>`;
    filtroDuracao.innerHTML = `<option value="">Todos</option>`;

    Array.from(idiomasSet).sort().forEach(id => {
        filtroIdioma.innerHTML += `<option value="${id}">${id}</option>`;
    });

    Array.from(paisSet).sort().forEach(p => {
        filtroPais.innerHTML += `<option value="${p}">${p}</option>`;
    });

    Array.from(universidadeSet).sort().forEach(u => {
        filtroUniversidade.innerHTML += `<option value="${u}">${u}</option>`;
    });

    Array.from(duracaoSet)
        .sort((a, b) => a - b)
        .forEach(meses => {
            filtroDuracao.innerHTML += `
                <option value="${meses}">${formatarDuracao(meses)}</option>
            `;
        });
}

function aplicarFiltros() {

    const status = filtroStatus.value;
    const idioma = filtroIdioma.value;
    const pais = filtroPais.value;
    const universidade = filtroUniversidade.value;
    const duracao = filtroDuracao.value;
    const dupla = filtroDupGraduacao.value;

    lista.innerHTML = "";

    let filtrados = editais.filter(e => {

        if (status === "Abertos" && !e.status) return false;

        if (idioma && !e.idioma.includes(idioma)) return false;
        if (pais && e.pais !== pais) return false;
        if (universidade && e.universidade !== universidade) return false;
        if (duracao && e.duracao != duracao) return false;

        if (dupla && String(e.duplaGraduacao) !== dupla) return false;

        return true;
    });

    filtrados.forEach(e => {
        lista.innerHTML += `
            <div class="card" onclick='abrirPopUp(${JSON.stringify(e)})'">
                <div class="card-esquerda">
                    <h2>${e.universidade}</h2>
                    <strong>${e.pais}</strong>
                    <p>${formatarDuracao(e.duracao)}</p>
                    ${e.status ? `<p><strong>Inscrições:</strong> até ${e.dataDeEncerramentoIns}</p>` : `<p></p>`}
                </div>
                <h4>${e.ano}</h4>
            </div>
        `;
    });
}

function verificarStatus(dataEncerramento) {
    const hoje = new Date();
    const data = new Date(dataEncerramento);

    return data >= hoje;
}

[
    filtroStatus,
    filtroDuracao,
    filtroIdioma,
    filtroUniversidade,
    filtroDupGraduacao,
    filtroPais
].forEach(element => {
    if (element) element.addEventListener("change", aplicarFiltros);
});

const btn = document.querySelector(".dropdown-filtros");
const menu = document.querySelector("#filtros-container .dropdown-menu");

btn.addEventListener("click", () => {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
    if (!e.target.closest("#filtros-container")) {
        menu.style.display = "none";
    }
});

function abrirDetalhes(item) {A
    document.getElementById("modalTitulo").innerText = item.nome;
    document.getElementById("modalDescricao").innerText = item.descricao;
    document.getElementById("modalTurno").innerText = item.turno;
    document.getElementById("modalTipo").innerText = item.tipo;

    document.getElementById("detalhesModal").style.display = "block";
}

document.querySelector(".close").onclick = function () {
    document.getElementById("detalhesModal").style.display = "none";
};

function abrirPopUp(e) {
    document.getElementById("modal-universidade").innerText = e.universidade;
    document.getElementById("modal-pais").innerText = e.pais;
    document.getElementById("modal-idioma").innerText = e.idioma.join(", ");
    document.getElementById("modal-duracao").innerText = formatarDuracao(e.duracao);
    document.getElementById("modal-dupla").innerText = e.duplaGraduacao ? "Sim" : "Não";
    document.getElementById("modal-inscricao").innerText = e.status ? `Até ${e.dataDeEncerramentoIns}` : "Encerrado";
    document.getElementById("modal-ano").innerText = e.ano;

    document.getElementById("modal").style.display = "flex";
}

document.getElementById("modal-fechar").onclick = () => {
    document.getElementById("modal").style.display = "none";
};

window.onclick = (e) => {
    if (e.target.id === "modal") {
        document.getElementById("modal").style.display = "none";
    }
};
