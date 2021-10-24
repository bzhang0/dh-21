# Using the Tensorfow model
The Tensorflow model is accessible through the `predict.js` file. Therein exists a function named `predict` that allows you to query the model for a prediction.

## Steps
1. Add tensorflow.js as a dependency: 
```
$ npm install @tensorflow/tfjs-node
```
2. Import the `predict.js` file:
```js
// probably gonna need to edit this to find the right relative path
const model = require('dh21/tensorflow/predict');
```
3. Use the `predict()` function with a query (recommended 100 chars, but can be less)
```js
const query = 'hello my name is alan wen';
model.predict(query);
```