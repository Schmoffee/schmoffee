import {PropsWithChildren} from 'react';

export interface FooterType extends PropsWithChildren {
  type?: 'basket' | 'default';
  buttonVariant?: 'primary' | 'secondary' | 'tertiary';
  buttonText?: string;
  buttonDisabled: boolean;
  onPress: () => void;
  hide?: boolean;
  style?: any;
}
