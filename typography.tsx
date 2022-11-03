import React, { FC, PropsWithChildren } from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { Colors } from './theme';

interface BodyProps extends TextProps, PropsWithChildren {
  style?: any;
  color?: string;
  weight?: 'Regular' | 'Thin' | 'Bold' | 'Extrabld' | 'Black';
  size?: 'small' | 'medium' | 'large';
}

interface HeadingProps extends TextProps, PropsWithChildren {
  style?: any;
  color?: string;
  weight?: 'Regular' | 'Thin' | 'Bold' | 'Extrabld' | 'Black';
  size?: 'default' | 'large';
}

const bodyFontSizes = {
  small: 14,
  medium: 16,
  large: 18,
};

export const Body: FC<BodyProps> = ({ children, style, color, weight, size, ...props }) => {
  const textColor = color ? color : Colors.black;
  const fontFamily = weight ? 'ProximaNova-' + weight : weight === 'Thin' ? 'ProximaNovaT-Thin' : 'ProximaNova-Regular';
  let fontSize;
  switch (size) {
    case 'small':
      fontSize = bodyFontSizes.small;
      break;
    case 'medium':
      fontSize = bodyFontSizes.medium;
      break;
    case 'large':
      fontSize = bodyFontSizes.large;
      break;
  }

  const bodyStyles = StyleSheet.create({
    root: {
      fontFamily,
      fontSize,
      color: textColor,
    },
  });
  return (
    <Text style={[bodyStyles.root, style]} {...props}>
      {children}
    </Text>
  );
};

const headingFontSizes = {
  default: 32,
  large: 42,
};

export const Heading: FC<HeadingProps> = ({ children, style, color, weight, size, ...props }) => {
  const textColor = color ? color : Colors.black;
  const fontFamily = weight ? 'ProximaNova-' + weight : weight === 'Thin' ? 'ProximaNovaT-Thin' : 'ProximaNova-Regular';
  let fontSize;
  switch (size) {
    case 'default':
      fontSize = headingFontSizes.default;
      break;
    case 'large':
      fontSize = headingFontSizes.large;
      break;
  }

  const headingStyles = StyleSheet.create({
    root: {
      fontFamily,
      fontSize,
      color: textColor,
    },
  });
  return (
    <Text style={[headingStyles.root, style]} {...props}>
      {children}
    </Text>
  );
};

export const Error: FC<BodyProps> = ({ children }) => {
  return (
    <Body weight={'Bold'} size={'small'} color={Colors.red}>
      {children}
    </Body>
  );
};
