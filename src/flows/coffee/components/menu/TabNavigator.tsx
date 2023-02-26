import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Item } from '../../../../models';
import { Body, Heading } from '../../../common/typography';
import { CardSection } from './CardSection';

interface TabNavigatorProps {
  tab1: Item[];
  tab2: Item[];
  tab3: Item[];
  query: string;
}

const WIDTH = Dimensions.get('window').width;
const TabNavigator = (props: TabNavigatorProps) => {
  const [activeTab, setActiveTab] = useState('coffee');

  const handleTabPress = (tabname: string) => {
    setActiveTab(tabname);
  };

  useEffect(() => {
    if (activeTab === 'coffee' && props.tab1.length === 0) {
      if (props.tab2.length > 0) {
        setActiveTab('tea');
      } else if (props.tab3.length > 0) {
        setActiveTab('bakery');
      }
    } else if (activeTab === 'tea' && props.tab2.length === 0) {
      if (props.tab1.length > 0) {
        setActiveTab('coffee');
      } else if (props.tab3.length > 0) {
        setActiveTab('bakery');
      }
    } else if (activeTab === 'bakery' && props.tab3.length === 0) {
      if (props.tab1.length > 0) {
        setActiveTab('coffee');
      } else if (props.tab2.length > 0) {
        setActiveTab('tea');
      }
    }
  }, [props.tab1, props.tab2, props.tab3]);

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'coffee' ? styles.activeTab : null]}
          onPress={() => handleTabPress('coffee')}>
          <Body size='small' weight='Bold' style={[styles.tabText, activeTab === 'coffee' ? styles.activeTabText : null]}>Coffee</Body>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tea' ? styles.activeTab : null]}
          onPress={() => handleTabPress('tea')}>
          <Body size='small' weight='Bold' style={[styles.tabText, activeTab === 'tea' ? styles.activeTabText : null]}>Tea</Body>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'bakery' ? styles.activeTab : null]}
          onPress={() => handleTabPress('bakery')}>
          <Body size='small' weight='Bold' style={[styles.tabText, activeTab === 'bakery' ? styles.activeTabText : null]}>Bakery</Body>
        </TouchableOpacity>
      </View>
      <View style={styles.headerContainer}>
        <Heading size="default" weight="Extrabld" color={Colors.white}>
          {activeTab === 'coffee' && 'COFFEE'}
          {activeTab === 'tea' && 'TEA'}
          {activeTab === 'bakery' && 'BAKERY'}
        </Heading>
      </View>
      <View style={styles.cardSectionContainer}>
        {activeTab === 'coffee' && <CardSection items={props.tab1} />}
        {activeTab === 'tea' && <CardSection items={props.tab2} />}
        {activeTab === 'bakery' && <CardSection items={props.tab3} />}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    // flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    height: '27%',
    paddingTop: 30,
  },
  tab: {
    width: '33.33%',
    alignItems: 'center',
    padding: 16,
    height: 50,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    minWidth: 80,
    maxWidth: 150,
    height: 20,
    textAlign: 'center',
  },
  activeTab: {
    borderBottomWidth: 0,
    borderBottomEndRadius: 40,
    borderBottomStartRadius: 40,
    borderBottomColor: '#fff',
  },
  activeTabText: {
    color: 'lightgrey',
  },
  cardSectionContainer: {
    // marginTop: -10,
    height: '120%',
    width: '100%',
    // flex: 1,
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  headerContainer: {
    alignItems: 'center',
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: 'center',
  },
});

export default TabNavigator;
