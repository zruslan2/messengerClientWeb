let choice = document.querySelector('#file');
let messageImg = document.querySelector('#messageImg');
let messageText = document.querySelector('#messageText');
let send = document.querySelector('.send');
let messages = document.querySelector('.messages');

let socket = new WebSocket("ws://127.0.0.1:15200");

let reader = new FileReader();

let url = "";

let user = {
    session: '',
    Id: '',
    chatName:'',
    phoneNumber:''
};

document.addEventListener("DOMContentLoaded", ready);

function ready(){
  let query = window.location.href.split("?")[1]; 
  let params = query.split("&"); 
  user.session = params[0].split("=")[1];
  user.Id = params[1].split("=")[1];
  user.chatName = decodeURIComponent(params[2].split("=")[1]);
  user.chatName.replace(/%20/g," ");
  user.phoneNumber = params[3].split("=")[1];
  console.log(user.session + " "+user.Id+" "+user.chatName+" "+user.phoneNumber);
  document.querySelector('.header').firstChild.innerText = user.chatName;
};

choice.onchange = openImg;

function openImg(){
  
  let file = this.files[0];

  reader.readAsArrayBuffer(file);

  var encodedData = window.btoa(reader.result);

  console.log(encodedData);    

  url = URL.createObjectURL(file);

  messageImg.src=url;

  console.log(url);
};

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

send.onclick = function(){

  let message = {
    type:"message",
    messageId:uuidv4(),
    sessionId:user.session,
    chatName:user.chatName,
    sender:user.phoneNumber,
    message:messageText.value,
    img:url
  };

  let json = JSON.stringify(message);

  socket.send(json);
};

socket.onopen = function(){

  let message = {
    type:"REQ",
    messageId:uuidv4(),
    sessionId:user.session,
    chatName:user.chatName,
    sender:user.phoneNumber,
    message:"",
    img:""
  };

  let json = JSON.stringify(message);

  socket.send(json);
}

socket.onmessage = function(event){
  let json = event.data;
  let message = JSON.parse(json);
  if(message.type=="message"){
    let inMessage = document.createElement('div');

    let inMessageHeader = document.createElement('div');
    let b = document.createElement('b');
    b.innerText = message.sender;
    inMessageHeader.appendChild(b);
    inMessage.appendChild(inMessageHeader);
    let inMessageBody = document.createElement('div');
    if(message.sender == user.phoneNumber){
      inMessage.className = "my";      
      inMessageHeader.className = "myHeader";      
      inMessageBody.className = "myBody";
    }
    else{
      inMessage.className = "someone";      
      inMessageHeader.className = "someoneHeader";      
      inMessageBody.className = "someoneBody";
    }   
    let img = document.createElement('img');
    img.className = "mesImg";
    if(message.img!=""){
      img.src=message.img;
    }
    inMessageBody.appendChild(img);
    let text = document.createElement('p');
    text.className = "mesText";
    text.innerText = message.message;
    inMessageBody.appendChild(text);
    inMessage.appendChild(inMessageBody);
    messages.appendChild(inMessage);
  } 
}
