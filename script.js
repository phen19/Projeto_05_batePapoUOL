let mensagens = [];
let participantes = [];
let usuario;

function entrarSala(){
    usuario = document.querySelector(".usuario").value;
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

function erro(){
    alert("Nome já utilizado, digite um novo")
    window.location.reload()
}

function buscarMensagens(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(carregarDados);
}

function buscarParticipantes(){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    promessa.then(carregarPart);
}

function carregarDados(dados){
    mensagens = dados.data;
    renderizarMensagens();
}

function carregarPart(part){
    participantes = part.data;
    renderizarParticipantes();
}

function renderizarMensagens(){
    const conteudo = document.querySelector(".conteudo");
    conteudo.innerHTML ="";
    
    for ( let i=0; i< mensagens.length;i++){
        if(mensagens[i].type === "status"){
            conteudo.innerHTML += `<div class="mensagem ${mensagens[i].type}"> 
                                    (${mensagens[i].time})&nbsp; <h2>${mensagens[i].from}</h2> &nbsp;${mensagens[i].text} 
                                    </div>
               `
        } if(mensagens[i].type === "private_message" && (mensagens[i].to === usuario || mensagens[i].from === usuario || mensagens[i].to === "Todos")) { // Mensagem privada = comparar usuário usado no site com o destinatário da mensagem no IF
            conteudo.innerHTML += `<div class="mensagem ${mensagens[i].type}"> 
                                   <span> (${mensagens[i].time})&nbsp; <strong>${mensagens[i].from}</strong> &nbsp; reservadamente para &nbsp; <strong>${mensagens[i].to}:</strong> &nbsp; ${mensagens[i].text} </span>
                                    </div>
               `
        } if(mensagens[i].type === "message") {
            conteudo.innerHTML += `<div class="mensagem"> 
                                    <span>(${mensagens[i].time})&nbsp; <strong>${mensagens[i].from}</strong> &nbsp; para &nbsp;<strong>${mensagens[i].to}:</strong> &nbsp;${mensagens[i].text} </span>
                                    </div>
               `
        }    
    }
    const mostrar = document.querySelector(".conteudo").lastElementChild
    mostrar.scrollIntoView()
}

function renderizarParticipantes(){
    const menu = document.querySelector(".menu-envio .participantes");
    menu.innerHTML = '<li onclick="selecionarContato(this)"><span><ion-icon name="people"></ion-icon>&nbspTodos</span><ion-icon class = "selecionado" name="checkmark-sharp"></ion-icon></li>';

    for (let i = 0; i<participantes.length; i++){
        menu.innerHTML += `<li onclick="selecionarContato(this)"><span><ion-icon name="person-circle"></ion-icon>&nbsp${participantes[i].name}</span><ion-icon name="checkmark-sharp"></ion-icon></li>`
    }

}

function enviarMensagem(){
    const envio = document.querySelector(".enviar").value
    const destinatario = document.querySelector(".participantes .selecionado").parentElement.textContent
    const visibilidade = document.querySelector(".visibilidade .selecionado").parentElement.textContent
    let tipo
        if(visibilidade ==="Privado"){
            tipo = "private_message"
        }else{
            tipo = "message"
        }
    const enviaAi = {
            from: usuario,
            to: destinatario,
            text: envio,
            type: tipo // ou "private_message" para o bônus
    }
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", enviaAi);
    requisicao.then(mensagemEnviada)
    requisicao.catch(mensagemErro)
}


function mensagemEnviada (){
    document.querySelector(".enviar").value = ""
    buscarMensagens();
}

function mensagemErro(){
    window.location.reload();
}

function envio(){
    const menu = document.querySelector(".menu-envio")
    menu.classList.remove("desativado")
    const escuro = document.querySelector(".escuro")
    escuro.classList.remove("desativado")
}

function hide(){
    const menu = document.querySelector(".menu-envio")
    menu.classList.add("desativado")
    const escuro = document.querySelector(".escuro")
    escuro.classList.add("desativado")
}

function selecionarContato(contatoSelecionado){
    let contato = document.querySelector(".participantes .selecionado");
        if (contato !== null){
            contato.classList.remove("selecionado");
        }
    contatoSelecionado.lastChild.classList.add("selecionado")
    attEnvio()
}

function selecionarVisibilidade(visibilidadeSelecionada){
    let visibilidade = document.querySelector(".visibilidade .selecionado");
        if (visibilidade !== null){
            visibilidade.classList.remove("selecionado");
        }
    visibilidadeSelecionada.lastChild.classList.add("selecionado")
    attEnvio()
}

function attEnvio(){
    let att = document.querySelector(".envio")
    const destinatario = document.querySelector(".participantes .selecionado").parentElement.textContent
    const visibilidade = document.querySelector(".visibilidade .selecionado").parentElement.textContent
    att.innerHTML = `Enviando para ${destinatario}`

    if(visibilidade === "Privado"){
        att.innerHTML += ` (reservadamente)`
    }
}

const meuInterval = setInterval(buscarMensagens, 3000);
const ativos = setInterval(buscarParticipantes,10000);

function refresh(){
    const att = {
        name: usuario
    }
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", att);
    requisicao.then();
    requisicao.catch();
}
const atualiza = setInterval(refresh, 4000);


let input = document.querySelector(".enviar");
input.addEventListener("keydown", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.querySelector(".botao").click();
  }
});

let input2 = document.querySelector(".usuario");
input2.addEventListener("keydown", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.querySelector("button").click();
  }
});


// document.querySelector(".selecionado").parentElement.textContent --> pegar o texto do usuário selecionado