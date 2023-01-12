import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {CardItem} from './CardItem';
import {Item} from '../../../../models';
import {Colors, Spacings} from '../../../common/theme';
import {Body} from '../../../common/typography';

interface CardSectionProps {
  title: string;
  items: Item[];
  hideDivider?: boolean;
  query?: string;
}

export const CardSection = (props: CardSectionProps) => {
  const {title, items} = props;
  return (
    <View style={[styles.container, {borderBottomColor: props.hideDivider ? 'transparent' : Colors.brownFaded2}]}>
      <Body size="large" weight="Bold" color={Colors.darkBrown2}>
        {title}
      </Body>
      {items && items.length > 0 ? (
        <FlatList
          horizontal
          data={items}
          contentContainerStyle={{paddingVertical: 16}}
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
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.goldFaded4,
    marginVertical: Spacings.s2,
    borderBottomWidth: 2,
    marginHorizontal: Spacings.s2,
  },
  cardContainer: {
    flexDirection: 'row',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacings.s2,
  },
});
