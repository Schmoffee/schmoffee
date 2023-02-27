import {useState, useEffect} from 'react';
import {Keyboard} from 'react-native';

function getNiceTime(date: number | string) {
  const actual_date = new Date(date);
  const hours = actual_date.getHours();
  const minutes = actual_date.getMinutes();
  return `${hours}:${minutes}`;
}

const useKeyboardVisible = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return isKeyboardVisible;
};

export {getNiceTime, useKeyboardVisible};
