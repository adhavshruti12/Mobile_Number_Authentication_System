import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDubz4LT1vvAvsApdVayzlqpcBiH_isxTg",
    authDomain: "mobile-number-authentica-34682.firebaseapp.com",
    projectId: "mobile-number-authentica-34682",
    storageBucket: "mobile-number-authentica-34682.firebasestorage.app",
    messagingSenderId: "121466803365",
    appId: "1:121466803365:web:0600fa4261f8557243e94c",
    measurementId: "G-2QG9RD9FTT"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  export { auth, RecaptchaVerifier, signInWithPhoneNumber };