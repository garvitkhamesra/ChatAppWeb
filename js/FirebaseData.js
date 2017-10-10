    var config = {
        apiKey: "AIzaSyAYy943yEEJn0q3JWMzrfmA0s4-SQqn1YA",
        authDomain: "chatapp-ec12b.firebaseapp.com",
        databaseURL: "https://chatapp-ec12b.firebaseio.com",
        projectId: "chatapp-ec12b",
        storageBucket: "",
        messagingSenderId: "981054926513"
    };
    firebase.initializeApp(config);

    const userStatus="";
// Validations 
   function validateName(x){
    var re = /[A-Za-z -']$/;
    if(re.test(document.getElementById(x).value)){
      document.getElementById(x).style.background ='#ccffcc';
      document.getElementById('nameError').style.display = "none";
      return true;
    }
    else{
      document.getElementById(x).style.background ='#F08080';
      document.getElementById('nameError').style.display = "block";
      return false; 
    }
  }

  function validateEmail(x){ 
    var spl = x.split('@');
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(x)){
        document.getElementById('reg_email').style.background ='#ccffcc';
        document.getElementById('emailError').style.display = "none";
        return true;
    }
    else{
        document.getElementById('reg_email').style.background ='#F08080';
        document.getElementById('emailError').style.display = "block";
        return false;
    }
  }

  function validatePassword(x){
      var passLength = document.getElementById(x).value.length;
      if(passLength>=6){
          document.getElementById(x).style.background ='#ccffcc';
          document.getElementById('pass_Error').style.display = "none";
          return true;
      }
      else{
          document.getElementById('pass_Error').style.display = "block";
          document.getElementById(x).style.background ='#F08080';
          return false;
      }

  }

  function validateForm(){
    var error = 0;
    document.getElementById('nameError').style.display = "block";
        if(!validateName('reg_name')){
      error++;
    }
    var x =document.getElementById('reg_email').value;
    if(!validateEmail(x)){
      document.getElementById('emailError').style.display = "block";
      error++;
    }
    if(!validatePassword('reg_pass')){
      document.getElementById('pass_Error').style.display = "block";
      error++;
    }
    if(error > 0){
      return false;
    }
    else if(error == 0){
        registerFunction();
    }
  } 

    function validateLoginForm(){
        var error = 0;
        var x =document.getElementById('reg_email').value;
        if(!validateEmail(x)){
            document.getElementById('emailError').style.display = "block";
            error++;
        }
        if(!validatePassword('password')){
        document.getElementById('pass_Error').style.display = "block";
        error++;
        }
        if(error > 0){
        return false;
        }
        else if(error == 0){
            loginFunction();
        }
  }    


function loginFunction(){
    var email = document.getElementById("reg_email").value;
    var password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(user){
        if(user.emailVerified){
            window.location=("index.html");
        }
        else{
            alert("Please Verify email");                
        }
    })
    .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    });
}

function registerFunction(){
    var email = document.getElementById("reg_email").value;
    var password = document.getElementById("reg_pass").value;
    var name = document.getElementById("reg_name").value;

    var userSend;
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(user){
        userSend = user;
        firebase.database().ref('Users/' + user.uid).set({
            name:name,
            status:"Hi There I'm Using Chatter",
            image:"default",
            thumb_image:"default"
        })
        .then(function(user){
            userSend.sendEmailVerification()
            .then(function() {
                alert('Email Verification Sent!');
                window.location=("login.html");
              })
            .catch(function(error){
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage);
            });
        });
    })
    .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    });
}

function checkUser(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          const list=firebase.database().ref().child('Users/').child(user.uid).once('value').then(function(snapshot) {
            var username = (snapshot.val() && snapshot.val().name) || 'Anonymous';
            var userStatus2 = (snapshot.val() && snapshot.val().status) || 'Anonymous';
            document.getElementById("dp").innerHTML = username;
            userStatus = userStatus2;
          });

        } else {
            window.location.href = "login.html"
        }
      });
}

function logout(){
    firebase.auth().signOut().then(function() {
        window.location.href = "login.html"
    }, function(error) {
        alert(error.message);
    });
}