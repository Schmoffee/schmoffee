import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {CardItem} from './CardItem';
import {Item} from '../../../../models';
import {Colors, Spacings} from '../../../common/theme';
import {Body} from '../../../common/typography';
import GifLoop from '../../../common/components/GifLoop';

interface CardSectionProps {
  items: Item[];
  hideDivider?: boolean;
  query?: string;
}

export const CardSection = (props: CardSectionProps) => {
  const {items} = props;

  return (
    <View style={[styles.container, {borderBottomColor: props.hideDivider ? 'transparent' : Colors.brownFaded2}]}>
      {items && items.length > 0 ? (
        <FlatList
          data={items}
          numColumns={2}
          // contentContainerStyle={{ paddingVertical: 16 }}
          contentInsetAdjustmentBehavior="never"
          snapToAlignment="center"
          decelerationRate="fast"
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={1}
          renderItem={({item, index}) => <CardItem query={props.query} item={item} index={index} />}
          keyExtractor={item => item.id}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Body size="medium" weight="Black" color={Colors.darkBrown2}>
            Uh oh... there's nothing here!
          </Body>
          <GifLoop />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacings.s2,
    height: '85%',
  },
  cardContainer: {
    flexDirection: 'row',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacings.s30,
  },
});
