
# Mobile Number Authentication with Firebase

This is a simple mobile number authentication system built using React and Firebase. It allows users to sign in using their mobile phone number. The project leverages Firebase's authentication service for seamless login and verification.

## Features

- **Phone Number Authentication**: Allows users to log in with their phone numbers.
- **Firebase Integration**: Firebase handles the phone number verification and authentication process.
- **React Frontend**: Built with React to provide a modern, interactive user experience.

## Technologies Used

- **React**: For building the user interface.
- **Firebase Authentication**: For handling mobile number authentication.
- **CSS**: For styling the components.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
```
### 2. Install Dependencies
Navigate to the project directory and install the required dependencies:
```bash
cd your-repo-name
npm install
```

### 3. Firebase Configuration
Set up Firebase in your project:

Go to Firebase Console.
Create a new project or use an existing one.
Enable Phone Authentication in the Firebase Authentication settings.
Obtain the Firebase configuration keys for your project and create a .env file in the root of your project with the following:
```bash
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### 4. Run the Application
Once the setup is complete, you can run the app using the following command:
```bash
npm start
```

# Folder Structure
```bash
/src
  /components
    PhoneAuth.js      # Component for phone number authentication
  App.js              # Main application file
  App.css             # Styling for the app

```



