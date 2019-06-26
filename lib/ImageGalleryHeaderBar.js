import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import Colors from './Colors';
import Layout from './Layout';
import { shallowEquals } from './ShallowEquals';

class ImageGalleryHeaderBar extends React.Component {
  static propTypes = {
    activeItemNumber: PropTypes.number,
    listLength: PropTypes.number,
    animatedOpacity: PropTypes.object.isRequired,
    onPressDone: PropTypes.func.isRequired,
    renderRight: PropTypes.func,
  };

  static getDataProps(data) {
    let { imageGallery } = data;
    let list = imageGallery.get('list');
    let item = imageGallery.get('item');

    let activeItemNumber;
    let listLength;

    if (list && item) {
      activeItemNumber = list.get('items').indexOf(item) + 1;
      listLength = list.get('items').count();
    }

    return { activeItemNumber, listLength };
  }

  shouldComponentUpdate(nextProps) {
    return !shallowEquals(this.props, nextProps);
  }

  render() {
    let {
      animatedOpacity,
      activeItemNumber,
      listLength,
      onPressDone,
      style,
    } = this.props;

    let rightAction;
    if (this.props.renderRight) {
      rightAction = this.props.renderRight(onPressDone);
    } else {
      rightAction = (
        <TouchableOpacity
          onPress={onPressDone}
          hitSlop={{
            top: 4,
            bottom: 5,
            left: 25,
            right: 20,
          }}>
          <Text style={styles.headerBarButtonText}>Schließen</Text>
        </TouchableOpacity>
      );
    }

    return (
      <Animated.View style={[style, {opacity: animatedOpacity}]}>
        <Text style={styles.headeBarTitleText}>
          {activeItemNumber} / {listLength}
        </Text>

        <View style={styles.headerBarRightAction}>
          {rightAction}
        </View>
      </Animated.View>
    );
  }
}

export default connect(
  data => ImageGalleryHeaderBar.getDataProps(data),
)(ImageGalleryHeaderBar);

let styles = StyleSheet.create({
  headeBarTitleText: {
    color: Colors.barTitle,
  },
  headerBarButtonText: {
    color: Colors.enabledButtonText,
    fontSize:18,
  },
  headerBarRightAction: {
    position: 'absolute',
    top: Layout.statusBarHeight,
    bottom: 0,
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

