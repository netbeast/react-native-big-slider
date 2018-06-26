/**
 * @providesModule %BigSlider
 * @flow
 */

import React, {Component} from 'react'
import {Animated, PanResponder, StyleSheet, Text, View} from 'react-native'

export default class BigSlider extends Component {
  static defaultProps = {
    value: 40,
    height: 300,
    maximumValue: 100,
    minimumValue: 0,
    onSlidingStart: () => {},
    onValueChange: () => {},
    onSlidingComplete: () => {},
  }

  constructor (props: Object) {
    super()
    this.state = {
      anchorValue: parseFloat(props.value),
      value: parseFloat(props.value),
    }

    this.range = props.maximumValue - props.minimumValue
  }

  state: {
    anchorValue: number,
    value: number,
  }

  componentWillMount () {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.props.onSlidingStart()
        this.setState({anchorValue: this.state.value})
      },
      onPanResponderMove: Animated.event([null, {}], {
        listener: this.handleSlide,
      }),
      onPanResponderRelease: () => {
        this.props.onSlidingComplete()
      },
    })
  }

  slideTo = (value: number) => {
    this.setState({value})
  }

  handleSlide = (evt: Object, gestureState: Object) => {
    const {maximumValue, minimumValue} = this.props
    const valueIncrement =
      -gestureState.dy * this.range / this.props.height
    let nextValue = this.state.anchorValue + valueIncrement
    nextValue = nextValue >= maximumValue ? maximumValue : nextValue
    nextValue = nextValue <= minimumValue ? minimumValue : nextValue
    this.props.onValueChange(nextValue)
    this.setState({value: nextValue})
  }

  panResponder: Object
  range: number

  renderLabel = () => {
    if (this.props.noLabel) {
      return null
    }
    if (this.state.value < 30) {
      return null
    }

    return this.props.renderLabel ? (
      this.props.renderLabel()
    ) : (
      <View style={styles.trackLabel}>
        <Text style={[styles.trackLabelText, this.props.labelStyle]}>
          {this.props.label || `${formatNumber(this.props.value)}%`}
        </Text>
      </View>
    )
  }

  renderPendingTrackLabel = () => {
    if (this.props.noPendingTrackLabel || this.state.value >= 30) {
      return null
    }

    return this.props.renderPendingTrackLabel ? (
      this.props.renderPendingTrackLabel()
    ) : (
      <View style={styles.trackLabel}>
        <Text style={styles.trackLabelText}>
          {this.props.label || `${formatNumber(this.props.value)}%`}
        </Text>
      </View>
    )
  }

  render () {
    const {value} = this.state
    const unitValue = (value - this.props.minimumValue) / this.range

    return (
      <View
        style={[styles.container, this.props.style]}
        {...this.panResponder.panHandlers}>
        <View style={[styles.pendingTrack, {flex: 1 - unitValue}]}>
          {this.renderPendingTrackLabel()}
        </View>
        <View style={[styles.track, {flex: unitValue}, this.props.trackStyle]}>
          <View style={[styles.thumb, this.props.thumbStyle]} />
          {this.renderLabel()}
        </View>
      </View>
    )
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
    justifyContent: 'center',
    alignItems: 'center',
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

function formatNumber (x = 0) {
  return parseInt(x, 10)
    .toFixed(1)
    .replace(/\.?0*$/, '')
}
