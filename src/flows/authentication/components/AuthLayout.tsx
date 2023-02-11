import React, { PropsWithChildren, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import Animated, {
  FadeOutLeft,
  FadeInRight,
  FadeOut,
  FadeInLeft,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Mode } from '../screens/AuthPage';
import { FooterType } from '../../../utils/types/component.types';
import { BlurView } from '@react-native-community/blur';
import { Body, Heading } from '../../common/typography';
import { Colors, Spacings } from '../../common/theme';
import { Footer } from '../../common/components/Footer';

interface AuthLayoutProps extends PropsWithChildren {
  style?: any;
  headerChildren?: React.ReactNode;
  subHeader: string;
  footer?: FooterType;
  transformContent?: boolean;
  onPress?: () => void;
  backgroundColor?: string;
  showCircle?: boolean;
  hamburger?: boolean;
  hamburgerOnPress?: () => void;
  mode: Mode;
  planetAnim: Animated.SharedValue<number>;
  asteroidAnim: Animated.SharedValue<number>;
  asteroidAnimFinal: Animated.SharedValue<number>;
}

export const AuthLayout = (props: AuthLayoutProps) => {
  const backgroundStyle = props.backgroundColor || Colors.white;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', () => {
      setKeyboardVisible(true); // or some other action
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardVisible(false); // or some other action
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const animatePlanet = useAnimatedStyle(() => {
    let rotate = interpolate(props.asteroidAnim.value, [0, 1], [0, 90], Extrapolate.CLAMP);

    return {
      transform: [
        {
          translateY: interpolate(props.planetAnim.value, [0, 0.9], [0, -200]),
        },
        {
          translateX: interpolate(props.planetAnim.value, [0, 0.9], [0, -300]),
        },
        {
          // rotate: interpolate(props.planetAnim.value, [0, 1], [0, 1])
          rotate: `${rotate}deg`,
        },
      ],
    };
  });

  const animateAsteroid = useAnimatedStyle(() => {
    let rotate = interpolate(props.asteroidAnim.value, [0, 1], [-90, -200], Extrapolate.CLAMP);

    return {
      transform: [
        { scale: 0.2 },
        { translateY: interpolate(props.asteroidAnim.value, [0, 1], [0, -700]) },
        { translateX: interpolate(props.asteroidAnim.value, [0, 1], [0, 1000]) },
        {
          // rotate: interpolate(props.asteroidAnim.value, [0, 1], [-1.6, -3.3])
          rotate: `${rotate}deg`,
        },
      ],
    };
  });

  // const animateAsteroidFinal = useAnimatedStyle(() => {
  //     return {
  //         transform: [
  //             { scale: 0.2 },
  //             { translateY: interpolate(props.asteroidAnimFinal.value, [0, 1], [-700, -3000]) },
  //             { translateX: interpolate(props.asteroidAnimFinal.value, [0, 1], [1000, 3000]) },
  //             { rotate: `${-12.3}deg` }
  //         ],
  //         opacity: interpolate(props.asteroidAnimFinal.value, [0, 1], [1, 0])
  //     };
  // });

  return (
    <KeyboardAvoidingView enabled behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
      <Pressable onPress={props.onPress} />
      <View style={[styles.root, { backgroundColor: backgroundStyle }]}>
        <Animated.Image source={require('../../../assets/pngs/planet_brown.png')} style={[styles.planet, animatePlanet]} />
        <Animated.Image
          source={require('../../../assets/pngs/asteroid.png')}
          style={[styles.asteroid, animateAsteroid]}
        />
        <View style={[styles.headingContainer]}>
          <View style={styles.header}>
            {props.mode === 'login' && (
              <>
                <Animated.View
                  entering={FadeInRight.damping(1000).duration(1000)}
                  exiting={FadeOutLeft.damping(500).duration(700)}>
                  <Heading size="large" weight="Bold" color={Colors.black}>
                    Log in
                  </Heading>
                </Animated.View>

                <Animated.View
                  entering={FadeInLeft.damping(1000).duration(1000)}
                  exiting={FadeOut.damping(1000)}
                  style={styles.subHeader}>
                  <Body size="medium" weight="Bold" color={Colors.greyLight3} style={styles.subHeader}>
                    {props.subHeader}
                  </Body>
                </Animated.View>
              </>
            )}

            {props.mode === 'signup' && (
              <>
                <Animated.View
                  entering={FadeInRight.damping(1000).duration(1000)}
                  exiting={FadeOutLeft.damping(1000).duration(700)}>
                  <Heading size="large" weight="Bold" color={Colors.black}>
                    Sign up
                  </Heading>
                </Animated.View>

                <Animated.View
                  entering={FadeInLeft.damping(1000).duration(1000)}
                  exiting={FadeOut.damping(1000)}
                  style={styles.subHeader}>
                  <Body size="medium" weight="Bold" color={Colors.greyLight3} style={styles.subHeader}>
                    {props.subHeader}
                  </Body>
                </Animated.View>
              </>
            )}

            {props.mode === 'verify' && (
              <View style={styles.verificationContainer}>
                <Animated.View
                  entering={FadeInRight.damping(1000).duration(1000)}
                  exiting={FadeOutLeft.damping(1000).duration(700)}>
                  <Heading size="large" weight="Bold" color={Colors.black}>
                    Verification
                  </Heading>
                </Animated.View>

                <Animated.View
                  entering={FadeInLeft.damping(1000).duration(1000)}
                  exiting={FadeOut.damping(1000)}
                  style={styles.subHeader}>
                  <Body size="medium" weight="Bold" color={Colors.greyLight3} style={styles.subHeader}>
                    Please check your texts for a confirmation code
                  </Body>
                </Animated.View>
              </View>
            )}
          </View>
        </View>

        {isKeyboardVisible ? (
          <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={styles.blurView}>
            <BlurView
              style={styles.absolute}
              blurType="light"
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
            />
          </Animated.View>
        ) : null}

        <View style={styles.contentContainer}>{props.children}</View>
        {props.footer ? (
          <View>
            <Footer {...props.footer} />
          </View>
        ) : null}
      </View>
      {/* </Pressable> */}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingTop: Spacings.s11,
    paddingBottom: Spacings.s9,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
  },
  planet: {
    position: 'absolute',
    top: 50,
    right: -230,
    zIndex: -1,
  },
  asteroid: {
    position: 'absolute',
    top: -80,
    left: -400,
    zIndex: -1,
  },
  headingContainer: {
    paddingHorizontal: Spacings.s6,
    marginVertical: Spacings.s7,
  },
  header: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: Spacings.s7,
    flexDirection: 'column',
  },
  subHeader: {
    alignSelf: 'flex-start',
    marginTop: Spacings.s1,
    textAlign: 'left',
    width: '60%',
  },
  verificationContainer: {
    marginTop: '70%',
  },
  childrenContainer: {
    marginBottom: Spacings.s4,
  },
  absolute: {
    position: 'absolute',
    top: '10%',
    left: 0,
    bottom: '30%',
    right: 0,
    height: 20000,
  },
  blurView: {
    position: 'absolute',
    top: '10%',
    left: 0,
    bottom: '1%',
    right: 0,
    height: '1%',
  },
});
