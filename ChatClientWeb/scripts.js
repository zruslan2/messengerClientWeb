let inpPhone = document.querySelector('#inpPhone');
let inpPassword = document.querySelector('#inpPassword');
let btnSignIn = document.querySelector('#signIn');
let registration = document.querySelector('.reg');
let header = document.querySelector('.header');

let metod = "sign-in";
let result;
let shortUser;

registration.onclick = function(){

  let regImg = document.createElement('img');
  regImg.className = 'icon';
  regImg.src = "img/reg.svg";  

  let text = document.createElement('b');
  text.innerHTML = "Регистрация";

  header.innerHTML="";
  header.appendChild(regImg);
  header.appendChild(text);

  let text1 = document.createElement('b');
  text1.innerHTML = "Зарегистрироваться";
  
  btnSignIn.innerHTML = "";  
  btnSignIn.appendChild(text1);

  metod = "sign-up";    
}

function ComeBack(){

  let avtImg = document.createElement('img');
  avtImg.className = 'icon';
  avtImg.src = "img/avtor.svg";  

  let text = document.createElement('b');
  text.innerHTML = "Авторизация";

  header.innerHTML="";
  header.appendChild(avtImg);
  header.appendChild(text);

  let avtImg1 = document.createElement('img');
  avtImg1.className = 'icon';
  avtImg1.src = "img/SignIn.svg";  

  let text1 = document.createElement('b');
  text1.innerHTML = "Войти";

  btnSignIn.innerHTML="";
  btnSignIn.appendChild(avtImg1);
  btnSignIn.appendChild(text1);

  metod = "sign-in";
}

async function SignUp(){

  let user = {
    phoneNumber: inpPhone.value,
    password: inpPassword.value
  };
  
  let json = JSON.stringify(user);

  let response = await fetch('http://localhost:15100/app/sign-up', {
        method: 'POST',       
        body: json
      });         

      result = await response.text();
      console.log(result);      
}

async function SignIn(){

  let user = {
    phoneNumber: inpPhone.value,
    password: inpPassword.value
  };
  
  let json = JSON.stringify(user);      
  
  let response = await fetch('http://localhost:15100/app/sign-in', {
    method: 'POST',
    /*headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },*/
    body: json
  });
  
  if (response.ok) {
    //alert("OK: " + response.status);      
  } else {
    alert("Ошибка HTTP: " + response.status);
  }

  let json1 = await response.json();  
  let val = JSON.stringify(json1);
  shortUser = JSON.parse(val);
  console.log(shortUser.session);    
  return response.status;
}

btnSignIn.onclick = async function(){
  
  if(metod == "sign-in"){    
    let status = await SignIn();  
    if(status == 200)
    {
      document.location.href="/base.html?session="+shortUser.session+"&userId="+shortUser.Id+"&phoneNumber="+shortUser.phoneNumber;  
    }    
  }
  else{
    await SignUp();
    if(result!="")
    {     
        if(result = "OK!")
        {
          alert('Вы успешно зарегистрированны!')
        }     
      result="";
      ComeBack();      
    }
  }    
}
