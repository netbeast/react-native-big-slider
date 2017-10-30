/**
 * @providesModule %BigSlider
 * @flow
 */

import React, { Component } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class BigSlider extends Component {
  static defaultProps = {
    value: 40,
    maximumValue: 100,
    minimumValue: 0,
    onSlidingStart: () => {},
    onValueChange: () => {},
    onSlidingComplete: () => {},
  }

  constructor(props) {
    super()
    this.state = {
      value: props.value,
    }

    this.range = props.maximumValue - props.minimumValue
  }

  componentWillMount () {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.props.onSlidingStart()
        this.setState({ anchorValue: this.state.value })
      },
      onPanResponderMove: Animated.event([null, {}], { listener: this.handleSlide }),
      onPanResponderRelease: (evt, gestureState) => {
        this.props.onSlidingComplete()
      },
    })
  }

  slideTo = (value) => {
    this.setState({value})
  }

  onLayout = ({ nativeEvent }) => {
    this.setState({
      width: nativeEvent.layout.width,
      height: nativeEvent.layout.height,
    })
  }

  handleSlide = (evt, gestureState) => {
    const { maximumValue, minimumValue } = this.props
    let valueIncrement = (-gestureState.dy * this.range) / this.state.height
    let nextValue = this.state.anchorValue + valueIncrement
    nextValue = nextValue >= maximumValue ? maximumValue : nextValue
    nextValue = nextValue <= minimumValue ? minimumValue : nextValue

    this.props.onValueChange(nextValue)
    this.setState({ value: nextValue })
  }

  render () {
    const value = this.state.value
    const unitValue = (value - this.props.minimumValue) / this.range

    return (
      <View
        onLayout={this.onLayout}
        style={[styles.container, this.props.style]}
        {...this.panResponder.panHandlers}>
        <View style={[styles.pendingTrack, { flex: 1 - unitValue }]} />
        <View style={[styles.track, { flex: unitValue }, this.props.trackStyle]}>
          <View style={styles.thumb} />
          {this.props.renderLabel
            ? this.props.renderLabel()
            : <View style={styles.trackLabel}>
              <Text style={styles.trackLabelText}>
                {this.props.label || `${formatNumber(this.props.value)}%`}
              </Text>
            </View>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(241, 242, 247)',
    borderRadius: 12,
    overflow: 'hidden',
    width: 120,
  },
  pendingTrack: {
  },
  track: {
    flex: 1,
    backgroundColor: 'rgb(1, 160, 188)',
    borderRadius: 12,
    alignSelf: 'stretch',
  },
  trackLabel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackLabelText: {
    color: 'white',
    fontWeight: '600',
  },
  thumb: {
    backgroundColor: 'rgba(0,0,0,.5)',
    borderRadius: 12,
    height: 3,
    width: 24,
    marginTop: 6,
    alignSelf: 'center',
  },
})

function formatNumber (x) {
  return x.toFixed(1).replace(/\.?0*$/, '')
}
