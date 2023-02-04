import React, { PropsWithChildren } from 'react';
import { View, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { Footer } from './Footer';
import { Colors, Spacings } from '../theme';
import { Body, Heading } from '../typography';
import { FooterType } from '../../../utils/types/component.types';
import HamburgerIcon from '../../hamburger/components/HamburgerIcon';
import LeftChevronBackButton from './LeftChevronBackButton';

interface PageLayoutProps extends PropsWithChildren {
  style?: any;
  header: string;
  headerChildren?: React.ReactNode;
  subHeader?: string;
  footer?: FooterType;
  transformContent?: boolean;
  onPress?: () => void;
  backgroundColor?: string;
  showCircle?: boolean;
  hamburger?: boolean;
  hamburgerOnPress?: () => void;
  backButton?: boolean;
}

export const PageLayout = (props: PageLayoutProps) => {
  const backgroundStyle = props.backgroundColor || Colors.white;
  return (
    <>
      <Pressable onPress={props.onPress} />
      <View style={[styles.root, { backgroundColor: backgroundStyle }]}>
        {props.showCircle ? <View style={[styles.bigSemiCircle]} /> : null}
        <View style={styles.header}>
          <View style={styles.backChevron}>
            {/* <LeftChevronBackButton color={Colors.black} /> */}
          </View>
          {props.hamburger ? (
            <TouchableOpacity onPress={props.hamburgerOnPress}>
              <View style={styles.hamburgerButton}>
                <HamburgerIcon />
              </View>
            </TouchableOpacity>
          ) : null}
          <Heading size="default" weight="Extrabld" color={Colors.black}>
            {props.header}
          </Heading>
          <View style={styles.headerChildren}>{props.headerChildren}</View>
        </View>
        {props.subHeader ? (
          <View style={styles.subHeader}>
            <Body size="small" weight="Bold" color={Colors.greyLight3} style={styles.subHeader}>
              {props.subHeader}
            </Body>
          </View>
        ) : null}

        <View style={styles.contentContainer}>{props.children}</View>
        {props.footer ? (
          <View>
            <Footer {...props.footer} />
          </View>
        ) : null}
      </View>
      {/* </Pressable> */}
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: Spacings.s13,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContentContainer: {},
  header: {
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    // marginTop: Spacings.s12,
  },
  backChevron: {
    position: 'absolute',
    left: 0,
    top: -5,
  },
  headerChildren: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  hamburgerButton: {
    justifyContent: 'center',
    position: 'absolute',
    left: -90,
    top: -14,
  },
  subHeader: {
    alignSelf: 'center',
    marginTop: Spacings.s2,
    textAlign: 'center',
    width: '80%',
  },
  bigSemiCircle: {
    position: 'absolute',
    top: -150,
    width: '105%',
    justifyContent: 'center',
    height: '45%',
    borderRadius: 300,
    backgroundColor: Colors.darkBlue,
    overflow: 'hidden',
  },
  childrenContainer: {
    marginBottom: Spacings.s4,
  },
});
