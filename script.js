let mensagens = [];

function entrarSala(){
    const usuario = document.querySelector(".usuario").value;
    const entrada = document.querySelector(".entrada")
    entrada.innerHTML = '<img src="./images/logo 1.png" width ="130px" height="92px"> <img src="./images/Loading_icon.gif"> Entrando...'
    const entraAi = {
        name: usuario
    };
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", entraAi);

    requisicao.then(sucesso);
    requisicao.catch(erro);
}

function sucesso(){
    const entrar = document.querySelector(".entrada")
    entrar.classList.add("desativado")
}

function erro(error){
    alert("Nome já utilizado, digite um novo")
    window.location.reload()
}

function buscarMensagens(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(carregarDados);
}

function carregarDados(dados){
    mensagens = dados.data;
    renderizarMensagens();
}

function renderizarMensagens(){
    const conteudo = document.querySelector(".conteudo");
    conteudo.innerHTML ="";
    
    for ( let i=0; i< mensagens.length;i++){
        if(mensagens[i].type === "status"){
            conteudo.innerHTML += `<div class="mensagem ${mensagens[i].type}"> 
                                    <h1>(${mensagens[i].time}) </h1>
                                    <h2> ${mensagens[i].from} </h2>
                                    <h3> ${mensagens[i].text} </h3>
                                    </div>
               `
        } if(mensagens[i].type === "private_message") { // Mensagem privada = comparar usuário usado no site com o destinatário da mensagem no IF
            conteudo.innerHTML += `<div class="mensagem"> 
                                    <h1>(${mensagens[i].time}) </h1>
                                    <h2> ${mensagens[i].from} </h2> <h1> para </h1> <h2> ${mensagens[i].to} </h2>
                                    <h3> ${mensagens[i].text} </h3>
                                    </div>
               `
        } if(mensagens[i].type === "message") {
            conteudo.innerHTML += `<div class="mensagem"> 
                                    <h1>(${mensagens[i].time}) </h1>
                                    <h2> ${mensagens[i].from} </h2> <h1> para </h1> <h2> ${mensagens[i].to} </h2>
                                    <h3> ${mensagens[i].text} </h3>
                                    </div>
               `
        }    
    }
    const mostrar = document.querySelector(".conteudo").lastElementChild
    mostrar.scrollIntoView()
}


function selecionarContato(contatoSelecionado){
    let contato = document.querySelector(".participantes .selecionado");
        if (contato !== null){
            contato.classList.remove("selecionado");
        }
    contatoSelecionado.lastChild.classList.add("selecionado")
}

function selecionarVisibilidade(visibilidadeSelecionada){
    let visibilidade = document.querySelector(".visibilidade .selecionado");
        if (visibilidade !== null){
            visibilidade.classList.remove("selecionado");
        }
    visibilidadeSelecionada.lastChild.classList.add("selecionado")
}

const meuInterval = setInterval(buscarMensagens, 3000);


// document.querySelector(".selecionado").parentElement.textContent --> pegar o texto do usuário selecionado