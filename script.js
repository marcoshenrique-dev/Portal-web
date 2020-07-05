/*

    Portal de Links e acessos - JS

    Autor : Marcos Henrique Silveira Dias 🔥
    Canal do Youtube : https://www.youtube.com/channel/UC3ZaLCltfI-34EQaZmWFaeg 😎

*/


const firebaseConfig = {

  // Sua config do firebase - você pode acha-lá dentro da aplicação web e config

};

firebase.initializeApp(firebaseConfig); // Inicializa o firebase

let db = firebase.firestore(); // Inicializa o banco de dados firestore

function getContent(folders) {  // função que busca as pastas

  let elemento_pai = document.querySelector(".content");


  folders.map((item, index) => { // Percorre todas as pastas e cria os elementos

    let box = document.createElement("div");
    box.setAttribute("class", "boxData");

    elemento_pai.appendChild(box);

    let nome = document.createElement("h1");
    let textNome = document.createTextNode(item.nome);
    nome.appendChild(textNome);
    nome.setAttribute("class", "click");
    nome.setAttribute("id", index);

    let quant = document.createElement("p");
    let textQuant = document.createTextNode(`${item.links.length} ${item.links.length == 1 ? "link" : "links"}`);
    quant.appendChild(textQuant);

    let remove = document.createElement('button');
    let textButton = document.createTextNode("Remover");
    remove.appendChild(textButton);

    remove.setAttribute("id", index);
    remove.setAttribute("class", "remove");


    box.appendChild(nome);
    box.appendChild(remove);
    box.appendChild(quant);


  });

  click(); // Chama função click

}

function login() { // Função que faz o login da aplicação

  const loginBox = document.querySelector('.login');
  const password = document.querySelector('#senha').value;

  if (localStorage.getItem("identify") != null) { //Caso já tenha o local storage salvo

    db.collection("login").get().then((snapshot) => { // Busca no banco

      snapshot.forEach((doc) => {

        if (localStorage.getItem("identify") === doc.data().senha) {

          localStorage.setItem("folders", JSON.stringify(doc.data().folders));

          getContent(JSON.parse(localStorage.getItem("folders"))); // chama a get content

        }



      });


    });

    loginBox.classList.add("active"); // Desabilita o login

  } else { // se não

    db.collection("login").get().then((snapshot) => { // Busca os dados e valida se a senha é correta

      snapshot.forEach((doc) => {

        if (password === doc.data().senha) {


          loginBox.classList.add("active");

          localStorage.setItem("identify", doc.data().senha);
          localStorage.setItem("folders", JSON.stringify(doc.data().folders))

          getContent(JSON.parse(localStorage.getItem("folders"))); //Chama a get content
          return;

        }

      });



    });


  }

}

function click() { //Função que valida caso um elemento seja clicado

  const boxData = document.querySelectorAll(".click");
  const create = document.querySelector(".create");
  const close = document.querySelector(".close");
  const buttonDelete = document.querySelectorAll(".remove");



  for (let box of boxData) { // Caso o h1 seja clicado

    let valor = JSON.parse(localStorage.getItem("folders"));

    box.addEventListener("click", function () {

      valor[box.getAttribute("id")].links.map((item, index) => { //Passa por todos e


        window.open(item); // abre os links

      });



    })
  }

  for (let button of buttonDelete) { // Passa por todos os botões delete


    button.addEventListener("click", function () { // adiciona a eles um eventListener

      let id = button.getAttribute("id");
      console.log(id);

      let folders = JSON.parse(localStorage.getItem("folders"));


      remover(id, folders); // Chama a função que remove

    })
  }


  create.addEventListener("click", function () { // EventListener para caso clique no botão criar

    const edit = document.querySelector(".edit");

    edit.classList.add("active");

  })

  close.addEventListener("click", function () { // Evento para caso clique no botão fechar

    const edit = document.querySelector(".edit");

    edit.classList.remove("active");

  })





}

function renderInputs() { // função que vai renderizar os inputs

  let quant = document.querySelector(".quant");
  let elementoPai = document.querySelector(".contentInputs");

  for (let i = 0; i < quant.value; i++) { // Pega a quantidade definida nos links e cria os campos



    let input = document.createElement("input");
    input.setAttribute("placeholder", "Adicione seu link aqui");
    input.setAttribute("class", "input");
    input.setAttribute("class", "editInput");
    elementoPai.appendChild(input);

  }


}

function saveFolder() { // Função que salva as pastas no banco de dados

  const identify = localStorage.getItem("identify");
  let inputs = document.querySelectorAll(".editInput");
  let nome = document.querySelector(".nomeFolder").value;
  const edit = document.querySelector('.edit');

  let links = [];

  for (input of inputs) {

    links.push(input.value); // Busca todos os links adicionados
  }


  let newFolder = { // Cria uma nova pasta

    links,
    nome
  };

  let valor = JSON.parse(localStorage.getItem("folders")); // Busca o valor no localStorage


  valor.push(newFolder); // Adiciona a nova pasta

  db.collection("login").doc(identify).update({ //Atualiza o banco com os novos dados

    folders: valor,


  })
    .then(function () {

      edit.classList.remove("active");
      location.reload(); //Recarrega a página
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });




}


function remover(id, folders) { //Função que remove uma lista


  var resposta = confirm("Deseja remover esse item ?"); // Pergunta se deseja remover

  if (resposta == true) // sim ?
  {

    const identify = localStorage.getItem("identify");

    folders.splice(id, 1); // função que remove


    db.collection("login").doc(identify).update({ //Remove com o update sem a pasta 

      folders: folders,

    })
      .then(function () {


        location.reload();
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });

  }
  else {

  }


}



login(); // executa a função login -> :) fim do código
