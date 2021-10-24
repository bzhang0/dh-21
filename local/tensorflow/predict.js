// import tensorflow js
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

const MODEL_DIRECTORY = 'file://./tensorflow/model/model.json';
const modelInfo = JSON.parse(fs.readFileSync('./tensorflow/model/info.json'));
const sequenceLength = modelInfo.sequenceLength;
const charMap = new Map(Object.entries(modelInfo.charMap));

// predicts whether a query is truthful
// 1 = true, 0 = false
// returns: a float from 0 to 1
// query: a query at least sequenceLength long
async function predict(query) {
    // load layers model from disk
    const model = await tf.loadLayersModel(MODEL_DIRECTORY);

    // query to lowercase, remove punctuation, limit to sequence length
    const input = query.toLowerCase().replace(/[^a-z ]/g, '').split('').slice(0, sequenceLength);

    // if input isn't long enough, pad it with spaces
    const paddedInput = input.length < sequenceLength ? input.concat(Array(sequenceLength - input.length).fill(' ')) : input;

    // turn it into a tensor
    const inputTensor = tf.tensor2d([paddedInput.map(x => charMap.get(x))]);

    // predict
    const outputTensor = model.predict(inputTensor);

    // return it
    const data = await tf.sigmoid(outputTensor).data();
    const result = data[0];
    return result;
}

exports.predict = predict;