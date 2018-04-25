import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

import ImageZoom from 'react-native-image-pan-zoom';
import ImageGalleryPlaceholder from './ImageGalleryPlaceholder';
import { shallowEquals } from './ShallowEquals';
import calculateImageDimensions from './calculateImageDimensions';

export default class ImageGalleryImage extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    fadeInOnLoad: PropTypes.bool,
    width: PropTypes.number,
    isVisible: PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);

    this.state = { hideThrobber: false };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEquals(this.props, nextProps) ||
           !shallowEquals(this.state, nextState);
  }

  render() {
    let { item, width, isVisible } = this.props;

    let imageStyle = {
      width,
      height: width,
      opacity: isVisible ? 1 : 0,
      borderRadius: 0.1,
    };

    if (item.get('image_url')) {
      let imageUri = item.getIn(['asset', 'url']) || item.get('image_url');
      
      let {
        constrainedWidth,
        constrainedHeight,
        marginHorizontal,
        marginVertical,
      } = calculateImageDimensions(item, width);

      let imageLayout = {
        height: constrainedHeight,
        width: constrainedWidth,
        marginVertical,
        marginHorizontal,
      };

      let isAnimatedImage = item.getIn(['asset', 'type']) === 'animated_image';

      let image;
      if ((isAnimatedImage && this.props.isFocused) || !isAnimatedImage) {
        image = (
          <View style={{backgroundColor:'#000', flex:1, justifyContent: 'center', alignItems:'center'}}>
            <Image
                resizeMode="contain"
                style={{flex:1, width:'100%', height:width}}
                onLoadEnd={this._onImageLoad}
                source={{uri: imageUri}}
            />
          </View>
        );
      }

      let coverImage;
      if (isAnimatedImage) {
        let coverUri = item.getIn(['asset', 'cover', 'url']);
        coverImage = (
          <View style={{backgroundColor:'#000', flex:1, justifyContent: 'center', alignItems:'center'}}>
            <Image
                resizeMode="contain"
                style={{flex:1, width:'100%', height:width}}
                source={{uri: coverUri}}
            />
          </View>
        );
      }

      if (coverImage) {
        image = <View style={styles.absoluteFill}>{image}</View>;
      }

      let imageThumbUri = item.get('image_thumb_url');
      let thumbImage = (
          <View style={{backgroundColor:'#000', flex:1, justifyContent: 'center', alignItems:'center'}}>
            <Image
                resizeMode="contain"
                style={{flex:1, width:'100%', height:width}}
                source={{uri: imageThumbUri}}
            />
          </View>
      );

      return (
        <View style={imageStyle}>
          
          <ImageZoom 
            cropWidth={width}
            cropHeight={width}
            imageWidth={width}
            imageHeight={width}
            enableSwipeDown={false}
            panToMove={true}
          >
            {this._maybeRenderThrobber(thumbImage)}
            {coverImage}
            {image}
          </ImageZoom>
            
        </View>
      );
    } else {
      return <ImageGalleryPlaceholder style={imageStyle} />;
    }
  }

  _onImageLoad = () => {
    this.setState({hideThrobber: true});
  };

  _maybeRenderThrobber(image) {
    let { isVisible } = this.props;
    let { hideThrobber } = this.state;

    if (hideThrobber || !isVisible) {
      return;
    }

    //removed <ActivityIndicator />

    return (
      <View style={styles.throbberContainer}>
        {image}
      </View>
    );
  }
}

let styles = StyleSheet.create({
  throbberContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#e8e8ec',
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

});
