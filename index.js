// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    setPersistence,
    onAuthStateChanged  
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAUtHSCIC6dppZWq4uiCNUnodl3kVjrHk8",
    authDomain: "qatoto01.firebaseapp.com",
    projectId: "qatoto01",
    storageBucket: "qatoto01.appspot.com",
    messagingSenderId: "602715554452",
    appId: "1:602715554452:web:b20f66695b2750bef6aa81",
    measurementId: "G-4VDYT8H9PM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log("connected");
// const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// optional setting
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const auth = getAuth();
auth.languageCode = "it";

provider.setCustomParameters({
    login_hint: "user@example.com",
});

let loginSignUpBtn = document.querySelector(".login-signup-button");
loginSignUpBtn.addEventListener("click", (e) => {
    if (loginSignUpBtn.dataset.status != "loggedIn") {
        signInWithPopup(auth, provider)
            .then((result) => {
                let profileImg = document.querySelector(".account-circle");
                let profileName = loginSignUpBtn.querySelector("p");
                profileImg.remove();
                profileName.remove();
                loginSignUpBtn.classList.add("logged-in");
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;

                let profilePic = document.createElement("img");
                profilePic.setAttribute("src", `${user["photoURL"]}`);
                localStorage.setItem('profile', JSON.stringify(user));
                profilePic.classList.add("profile-img");
                profilePic.dataset.status = "loggedIn";
                loginSignUpBtn.dataset.status = "loggedIn";
                console.log(profilePic);
                document
                    .querySelector(".end-div-group")
                    .classList.add("login-realign");
                loginSignUpBtn.insertAdjacentElement("afterbegin", profilePic);
                // ...
            })
            .catch((error) => {
                
            });
    }
});

onAuthStateChanged(auth, (user) => {
    if(user) {
        console.log("user is signed in")
        let profileImg = document.querySelector(".account-circle");
        let profileName = loginSignUpBtn.querySelector("p");
        profileImg.remove();
        profileName.remove();
        loginSignUpBtn.classList.add("logged-in");
        let profilePic = document.createElement("img");
        profilePic.setAttribute("src", `${user["photoURL"]}`);
        localStorage.setItem('profile', JSON.stringify(user));
        profilePic.classList.add("profile-img");
        profilePic.dataset.status = "loggedIn";
        loginSignUpBtn.dataset.status = "loggedIn";
        console.log(profilePic);
        document
            .querySelector(".end-div-group")
            .classList.add("login-realign");
        loginSignUpBtn.insertAdjacentElement("afterbegin", profilePic);
    }else{
        console.log("user is signed out")
    }
})


document.querySelector('body').addEventListener('click', (e) => {
    if(document.contains(document.querySelector("[data-status='loggedIn']"))){
        if(e.target.dataset.status === 'loggedIn'){
            console.log(e.target);
            console.log(document.querySelector('.profilePopUp'));
            // console.log(document.querySelector('.profilePopUp').contains(e.target))
            // if(document.contains(document.querySelector(".profilePopUp")) && !document.querySelector('.profilePopUp').contains(e.target)){
            if(document.contains(document.querySelector(".profilePopUp"))){
                document.querySelector(".profilePopUp").remove();
            }else{
                const template = document.getElementById('profilePopUpTemplate');
                const templateClone = template.content.cloneNode(true);
                const signOutBtn = templateClone.querySelector('#signOut');
                signOutBtn.addEventListener('click', (e) => {
                    signOut(auth).then(() => {
                        const htmlCode = "<span class='material-symbols-outlined account-circle'>account_circle</span><p>Sign in</p>"
                        document.querySelector("img[data-status='loggedIn']").remove();
                        delete document.querySelector('.login-signup-button').dataset.status
                        document.querySelector('.login-signup-button').insertAdjacentHTML('beforeend',htmlCode);
                        document.querySelector('.login-signup-button').classList.remove('logged-in');
                        document
                        .querySelector(".end-div-group")
                        .classList.remove("login-realign");
                        document.querySelector('.profilePopUp').remove()
                    }).catch((error) => {
                    // An error happened.
                    });
                })
                console.log(templateClone);
                let loginSignUpBtn = document.querySelector(".login-signup-button");
                let user = JSON.parse(localStorage.getItem('profile'));
                const profilePic = templateClone.querySelector('#profileImg')
                profilePic.setAttribute('src', `${user['photoURL']}`)
                templateClone.querySelector('[data-user-name]').innerText = user['displayName']
                templateClone.querySelector('[data-user-email]').innerText = user['email']
                loginSignUpBtn.append( templateClone)
            }
        }else if(document.querySelector('.profilePopUp')?.contains(e.target)){
            console.log("Hello");
            console.log(e.target)
        }else{
            if(document.contains(document.querySelector(".profilePopUp"))){
                document.querySelector('.profilePopUp').remove();
            }
        }
    }
})


document.querySelector('[data-drawer-menu]').addEventListener('click', (e) => {
    document.querySelector('body').classList.toggle('side-rail-open');
})
