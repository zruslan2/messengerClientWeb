let chats = document.querySelector('.chats');
let addChat = document.querySelector('.addChat');
let addChatSubmit = document.querySelector('#addChatSubmit');
let selUser = document.querySelector('#users');
let inpChatName = document.querySelector('#inpChatName');

let user = {
  session: '',
  Id: '',
  phoneNumber:''
};
let users;

let result;

let r_chats;

let chatType = "UserToUserChat";

let SelectedElements = new Array;

document.addEventListener("DOMContentLoaded", ready);

function ready(){
  let query = window.location.href.split("?")[1]; 
  let params = query.split("&"); 
  user.session = params[0].split("=")[1];
  user.Id = params[1].split("=")[1];
  user.phoneNumber = params[2].split("=")[1];
  console.log(user.session + " "+user.Id);
}

window.onload = function(){   
    RecieveChats();    
  }
  
  async function RecieveChats(){
    let user1 = {
      session: user.session     
    };
    let json = JSON.stringify(user1);
  
    let response = await fetch('http://localhost:15100/app/get-chats', {
        method: 'POST',       
        body: json
      });         
  
    let json1 = await response.json();  
    let val = JSON.stringify(json1);
    r_chats = JSON.parse(val);
    fillChats();
    console.log(r_chats[0]);  
  }

  function fillChats(){
    chats.innerHTML = "";
    for (var i = 0; i < r_chats.length; i++){
      let chat = document.createElement('div');
      chat.className = 'chat';
      let text = document.createElement('b');
      text.innerText = r_chats[i];
      chat.appendChild(text);
      chats.appendChild(chat);      
    }
  }  

  let modal = document.getElementById('myModal');
  let span = document.querySelector(".close");  
  
  addChat.onclick = function() {
      modal.style.display = "block";
      RecieveUsers();
  }  
  
  span.onclick = closeModal;

  function closeModal(){
    modal.style.display = "none";
  }

  async function RecieveUsers(){
    let response = await fetch('http://localhost:15100/app/get-users');
    if(response.ok){
      let json1 = await response.json();  
      let val = JSON.stringify(json1);
      users = JSON.parse(val);
      let opts = '';
      for(let i in users){
        if(users[i].Id!=user.Id){
          opts += '<option value="' + users[i].Id + '">' + users[i].PhoneNumber + '</option>';
        }        
      }
      selUser.innerHTML = opts;
      console.log(selUser.attributes);
    }
    else{
      alert("Ошибка HTTP: " + response.status);
    }    
  }

  let g = document.querySelector("#g");
  let utu = document.querySelector("#utu");

  utu.onclick = function(){
    if(utu.checked==true){
      selUser.multiple = false;
      chatType = "UserToUserChat";
    }
  }

  g.onclick = function(){
    if(g.checked==true){
      selUser.multiple = true;
      chatType = "GroupChat";
    }
  }

  addChatSubmit.onclick = function(){
    addChatFunc();
    if(result = "OK!"){
      RecieveChats();
      fillChats();
      closeModal();
      result = "";
    }
  }
  
  function SelectedUsers(){    
    for(let i = 0;i<selUser.length;i++){
      if(selUser.options[i].selected){
        SelectedElements[i] = selUser.options[i].value;
      }      
    }
    SelectedElements[SelectedElements.length]=user.Id;
  }

  async function addChatFunc(){
    SelectedElements = [];
    SelectedUsers();
    let getChat = {
      Title: inpChatName.value,
      ChatRoomType: chatType,
      SelUsers:SelectedElements
    };

    let json = JSON.stringify(getChat);
  
    let response = await fetch('http://localhost:15100/app/add-chat', {
        method: 'POST',       
        body: json
      });    

    result = await response.text();
    console.log(result);   
  }
  
  chats.addEventListener('click', goToChat);

  function goToChat(event){
    let target = event.target;
    document.location.href="/chat.html?session="+user.session+"&userId="+user.Id
    +"&chatName="+encodeURIComponent(target.innerText)+"&phoneNumber="+user.phoneNumber;
  }