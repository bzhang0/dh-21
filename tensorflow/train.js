// import tensorflow js
const tf = require('@tensorflow/tfjs-node');
const data = require('./data.json');

// trains the model
async function start() {
    // get the training data from data
    const [trainXs, trainYs, testXs, testYs] = data.getData();

    // create the model
    const model = createModel();

    // train the model
    await trainModel(model, trainXs, trainYs);

    // evaluate the model
}

// start
start();

