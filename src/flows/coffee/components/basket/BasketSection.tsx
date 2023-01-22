import React, { useContext } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { OrderingContext } from '../../../../contexts';
import { BasketItem } from './BasketItem';
import { Colors, Spacings } from '../../../common/theme';
import { Body } from '../../../common/typography';
import { useNavigation } from '@react-navigation/native';
import { CoffeeRoutes } from '../../../../utils/types/navigation.types';

interface BasketSectionProps {
  translateY?: Animated.SharedValue<number>;
}

export const BasketSection = (props: BasketSectionProps) => {
  const { ordering_state } = useContext(OrderingContext);
  const navigation = useNavigation<CoffeeRoutes>();

  const height = 100;
  const maxHeight = 350;
  const getHeight = () => {
    if (ordering_state.specific_basket.length <= 1) {
      return height;
    } else if (ordering_state.specific_basket.length <= 2) {
      return height + 100;
    } else if (ordering_state.specific_basket.length >= 3) {
      return height + 250;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ height: getHeight(), maxHeight }}>
        {ordering_state.specific_basket.length === 0 && (
          <View style={styles.emptyContainer}>
            <Pressable onPress={() => navigation.navigate('ShopPage')}>
              <Body size="medium" weight="Bold" color={Colors.gold}>
                Click here to add some items to your basket!
              </Body>
            </Pressable>
          </View>
        )}
        <View style={styles.basketColumn}>
          <View style={styles.headerRow}>
            {ordering_state.specific_basket.map((item, index) => {
              return (
                <View style={styles.itemRow} key={item.id}>
                  <View style={styles.itemImage}>
                    <BasketItem key={index} item={item} />
                  </View>
                  <View style={styles.detailsColumn}>
                    <Body size="medium" weight="Bold" color={Colors.white}>
                      {item.name}
                    </Body>
                    <Body size="small" weight="Bold" color={Colors.greyLight2}>
                      {/* {item.description} */}
                    </Body>
                  </View>
                  <Body size="small" weight="Bold" color={Colors.greyLight2} style={{ position: 'absolute', right: 0 }}>
                    £{((item.price * item.quantity) / 100).toFixed(2)}
                  </Body>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkBrown,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
  },
  header: {
    height: 24,
    justifyContent: 'center',
    paddingHorizontal: Spacings.s2,
    paddingTop: Spacings.s2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacings.s8,
  },

  basketColumn: {
    // marginTop: Spacings.s4,
    flex: 1,

    flexDirection: 'column',
    alignItems: 'center',

    // backgroundColor: Colors.blue,
    marginBottom: Spacings.s1,
  },

  headerRow: {},

  itemRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: Spacings.s3,
    // backgroundColor: Colors.red,
    paddingHorizontal: Spacings.s14,
    marginRight: Spacings.s16,
  },

  detailsColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: Spacings.s4,
    marginRight: Spacings.s8,
  },

  itemImage: {
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addItemButton: {
    backgroundColor: Colors.brownLight2,
    borderRadius: Spacings.s3,
    height: 40,
    width: 40,
    marginTop: Spacings.s4,
    marginLeft: Spacings.s2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
