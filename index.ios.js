/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import BigSlider from './BigSlider'

export default class bigSlider extends Component {
  constructor() {
    super()
    this.state = { valA: 64, valB: 23 }
  }
  render () {
    return (
      <View style={styles.container}>
        <View padding={20} />
        <BigSlider minimumValue={-50}
          label={`${this.state.valA | 0}º`}
          value={this.state.valA} onValueChange={valA => {
            this.setState({ valA })
          }} />
        <View padding={20} flexDirection="row" flex={1}>
          <View flex={1}>
            <BigSlider
              horizontal
              maximumValue={120}
              style={{ width: 140 }}

              value={this.state.valB}
              minimumValue={-120} />
          </View>
          <View flex={1}>
            <BigSlider
              horizontal
              maximumValue={120}
              style={{ backgroundColor: 'rgba(0,0,0,.7)' }}
              trackStyle={{ backgroundColor: 'rgba(194, 61, 85, 1)' }}
              label="friction"
              minimumValue={-120} />
          </View>
        </View>
        <View padding={20} flexDirection="row" flex={1}>
          <View flex={1}>
            <BigSlider
              style={{ width: 80 }}
              renderLabel={() => <Text style={{textAlign:'center', padding: 20}}>
                Brightness
              </Text>}
              trackStyle={{ backgroundColor: 'rgba(143, 255, 160, .7)' }}
              maximumValue={30}
              minimumValue={-120}
              value={this.state.valB} />
          </View>
          <View flex={1}>
            <BigSlider
              style={{ width: 110 }}
              trackStyle={{ backgroundColor: 'rgb(255, 166, 102)' }}
              maximumValue={30}
              minimumValue={-120}
              value={this.state.valB} />
          </View>
          <View padding={20} />
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
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('bigSlider', () => bigSlider);
