module.exports = {
  presets:  ['@react-native/babel-preset'],
 
  plugins: [
    'react-native-reanimated/plugin', // Keep this line
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],

    ['module:react-native-dotenv', {
      moduleName: 'react-native-dotenv',
      path: '.env',
    }],
  ],
};