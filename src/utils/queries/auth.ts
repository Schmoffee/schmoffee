import {CognitoUser} from 'amazon-cognito-identity-js';
import {ErrorTypes} from '../enums';
import {Auth, DataStore} from 'aws-amplify';
const password = Math.random().toString(10) + 'Abc#';

async function signUp(
  phoneNumber: string,
  name: string,
): Promise<CognitoUser | null | ErrorTypes> {
  try {
    const {user} = await Auth.signUp({
      username: phoneNumber,
      password,
      attributes: {
        phone_number: phoneNumber,
        name: name,
      },
    });
    console.log('user successfully signed up!: ', user);
    return user;
  } catch (error) {
    console.log('Error signing up', error);
    return null;
  }
}

async function signIn(phoneNumber: string): Promise<CognitoUser | ErrorTypes> {
  try {
    return await Auth.signIn(phoneNumber);
  } catch (error: any) {
    if (error.code === 'UserNotFoundException') {
      // listen to message on the hub channel 'auth' for those errors and handle them accordingly there
      return ErrorTypes.USER_NOT_EXIST;
    } else if (error.code === 'UsernameExistsException') {
      return ErrorTypes.USERNAME_EXISTS;
    } else {
      console.log(error.code);
      return ErrorTypes.ELSE;
    }
  }
}

async function sendChallengeAnswer(
  OTP: string,
  user: CognitoUser,
): Promise<CognitoUser | null> {
  try {
    return await Auth.sendCustomChallengeAnswer(user, OTP);
  } catch (error) {
    // TODO: After 3rd error, block the field for a certain period of time
    console.log('The verification failed', error);
    return null;
  }
}

async function getCurrentAuthUser(): Promise<CognitoUser | null> {
  try {
    return await Auth.currentAuthenticatedUser();
  } catch (error) {
    console.log('error getting current user: ', error);
    return null;
  }
}

async function signOut() {
  try {
    await Auth.signOut();
  } catch (error) {
    console.log('error signing out: ', error);
  }
}

export {signUp, signIn, sendChallengeAnswer, getCurrentAuthUser, signOut};
