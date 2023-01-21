import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {EagerItem} from '../../../../models';
import {Heading} from '../../../common/typography';
import {CardSection} from './CardSection';

interface TabNavigatorProps {
  tab1: EagerItem[];
  tab2: EagerItem[];
  tab3: EagerItem[];
}

const WIDTH = Dimensions.get('window').width;
const TabNavigator = (props: TabNavigatorProps) => {
  const [activeTab, setActiveTab] = useState('coffee');

  const handleTabPress = (tabname: string) => {
    setActiveTab(tabname);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'coffee' ? styles.activeTab : null]}
          onPress={() => handleTabPress('coffee')}>
          <Text style={[styles.tabText, activeTab === 'coffee' ? styles.activeTabText : null]}>Coffee</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tea' ? styles.activeTab : null]}
          onPress={() => handleTabPress('tea')}>
          <Text style={[styles.tabText, activeTab === 'tea' ? styles.activeTabText : null]}>Tea</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'bakery' ? styles.activeTab : null]}
          onPress={() => handleTabPress('bakery')}>
          <Text style={[styles.tabText, activeTab === 'bakery' ? styles.activeTabText : null]}>Bakery</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <Heading size="default" weight="Extrabld" color={Colors.white}>
          {activeTab === 'coffee' && 'Coffee'}
          {activeTab === 'tea' && 'Tea'}
          {activeTab === 'bakery' && 'Bakery'}
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
    flex: 1,
    flexDirection: 'row',
    // borderBottomWidth: 3,

    paddingHorizontal: 20,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1,
    // backgroundColor: 'red',
  },
  tab: {
    width: '33.33%',
    alignItems: 'center',
    padding: 16,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    minWidth: 80,
    maxWidth: 150,
    textAlign: 'center',
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomEndRadius: 40,
    borderBottomStartRadius: 40,
    borderBottomColor: '#fff',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: 'lightgrey',
  },
  cardSectionContainer: {
    // flex: 1,
    marginTop: 140,
    // backgroundColor: 'red',
    height: '60%',
  },
  container: {
    // flex: 1,
    // backgroundColor: 'blue',
    height: '100%',
    width: WIDTH - 40,
  },
  headerContainer: {
    // flex: 1,
    // backgroundColor: 'red',
    height: '5%',
    alignItems: 'center',
  },
});

export default TabNavigator;
