/**
 * Handles the sign in button press
 */
function toggleLogIn() {
  var email = document.getElementById('login-email').value;
  var password = document.getElementById('login-password').value;

  // TODO: replace with more robust error checking
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password');
    return;
  }

  // Log in with email and password
  firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
    // Upon completion of promise, segue to home
    window.location = 'index.html';
  }).catch(function(error) {
    // Handle errors
    var errorCode = error.code;
    var errorMessage = error.message;

    if (errorCode === 'auth/wrong-password') {
      // TODO: replace with error message div using AJAX
      alert('Wrong password.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
  });
} // END toggleLogIn()



/**
 * Handles the sign up button press
 */
function handleSignUp() {
  var email = document.getElementById('signup-email').value;
  var password = document.getElementById('signup-password').value;
  var repeatedPassword = document.getElementById('repeated-password').value;

  // TODO: replace with more robust error checking
  if (email.length < 4) {
    alert('Please enter an email address');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password');
    return;
  }
  if (password !== repeatedPassword) {
    alert('Passwords do not match');
    return;
  }

  // Sign up with email and password
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
    // firebase.database().ref().child("users/" + user.uid).set({
    //   first_name: fname,
    //   last_name: lname,
    //   gender: gender,
    //   email: email,
    //   username: username,
    //   uid: user.uid
    // });
    // segue to home
    window.location = 'index.html';
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;

    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak');
    } else {
      alert(errorMessage);
    }
    console.log(error);
  });
} // END handleSignUp()



/**
 * Sends an email verification to the user
 */
function sendEmailVerification() {
  firebase.auth().currentUser.sendEmailVerification().then(function() {
    alert('Email Verification Sent!');
  });
} // END sendEmailVerification()



/**
 * Sends a password reset email to the user
 */
function sendPasswordReset() {
  var email = document.getElementById('login-email').value;

  firebase.auth().sendPasswordResetEmail(email).then(function() {
    alert('Password Reset Email Sent!');
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;

    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
  });
} // END sendPasswordReset()



/**
 * Handles segue to the home page and setting up event listeners
 */
function initApp() {

  document.getElementById('login-button').addEventListener('click', toggleLogIn, false);
  document.getElementById('signup-button').addEventListener('click', handleSignUp, false);
  // document.getElementById('send-verif').addEventListener('click', sendEmailVerification, false);
  // document.getElementById('password-reset').addEventListener('click', sendPasswordReset, false);
} // END initApp()
