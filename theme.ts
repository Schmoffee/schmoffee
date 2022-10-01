export const Colors = {
  white: '#FFFFFF',
  greyLight1: '#F5F5F5',
  greyLight2: '#E1E1E1',
  greyLight3: '#ADADAD',
  black: '#1D1D1D',
  black2: '#121212',
  greenLight: '#DEFFF1',
  green1: '#55CF9C',
  green2: '#3C936E',
  green3: '#1D563E',
  greenFaded1: '#EAEEEC',
  greenFaded2: '#D8E1DD',
  greenFaded3: '#8E9994',
  greenDark1: '#243530',
  greenDark2: '#153428',
  greenDark3: '#05110C',
  red: '#CE3F59',
  redFaded: '#FCBCC7',
};

export const Spacings = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s7: 28,
  s8: 32,
  s9: 36,
  s10: 40,
  s11: 44,
  s12: 48,
  s13: 52,
  s14: 56,
  s15: 60,
  s16: 64,
};

export const Buttons = {
  flow: {
    height: 56,
    borderRadius: 16,
    colors: {
      primary: {
        unpressed: {
          background: Colors.greenDark2,
          text: Colors.greyLight1,
        },
        pressed: {
          background: Colors.greenFaded3,
          text: Colors.greyLight1,
        },
        disabled: {
          background: Colors.greyLight2,
          text: Colors.greyLight3,
        },
      },
      secondary: {
        unpressed: {
          background: Colors.greenFaded1,
          text: Colors.greenDark2,
        },
        pressed: {
          background: Colors.greenFaded2,
          text: Colors.greenDark2,
        },
        disabled: {
          background: Colors.greyLight2,
          text: Colors.greyLight3,
        },
      },
    },
  },
};
