/**
 * @format
 */
import { decode, encode } from 'base-64';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { LogBox } from 'react-native';

AppRegistry.registerComponent(appName, () => App);
LogBox.ignoreLogs([
  'Support for defaultProps will be removed from function components',
]);