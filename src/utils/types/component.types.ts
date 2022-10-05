import {PropsWithChildren} from 'react';

export interface FooterType extends PropsWithChildren {
  buttonText?: string;
  buttonDisabled: boolean;
  onPress: () => void;
  hide?: boolean;
}
