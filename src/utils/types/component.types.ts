import { PropsWithChildren } from 'react';

export interface FooterType extends PropsWithChildren {
  buttonVariant?: 'primary' | 'secondary' | 'tertiary';
  buttonText?: string;
  buttonDisabled: boolean;
  onPress: () => void;
  hide?: boolean;
}

export interface CardItemType extends PropsWithChildren {
  title: string;
  price: string;
  image: string;
  onPress: () => void;
}