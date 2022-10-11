import {CognitoUser} from 'amazon-cognito-identity-js';
import {ErrorTypes} from '../types/enums';
import {Auth} from 'aws-amplify';
const password = Math.random().toString(10) + 'Abc#';

async function signUp(phoneNumber: string, name: string): Promise<CognitoUser | null | ErrorTypes> {
  try {
    const {user} = await Auth.signUp({
      username: phoneNumber,
      password,
      attributes: {
        phone_number: phoneNumber,
        name: name,
      },
    });
    return user;
  } catch (error: any) {
    if (error.code === 'UsernameExistsException') {
      return ErrorTypes.USERNAME_EXISTS;
    } else {
      console.log(error);
      return ErrorTypes.ELSE;
    }
  }
}

async function signIn(phoneNumber: string): Promise<CognitoUser | ErrorTypes> {
  try {
    return await Auth.signIn(phoneNumber);
  } catch (error: any) {
    if (error.code === 'UserNotFoundException') {
      return ErrorTypes.USER_NOT_EXIST;
    } else {
      console.log(error.code);
      return ErrorTypes.ELSE;
    }
  }
}

async function sendChallengeAnswer(OTP: string, user: CognitoUser): Promise<CognitoUser | null> {
  try {
    return await Auth.sendCustomChallengeAnswer(user, OTP);
  } catch (error) {
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

async function signOut(): Promise<boolean> {
  try {
    await Auth.signOut();
    return true;
  } catch (error) {
    console.log('error signing out: ', error);
    return false;
  }
}

async function globalSignOut(): Promise<boolean> {
  try {
    await Auth.signOut({global: true});
    return true;
  } catch (error) {
    console.log('error globally signing out: ', error);
    return false;
  }
}

export {signUp, signIn, sendChallengeAnswer, getCurrentAuthUser, signOut, globalSignOut};
