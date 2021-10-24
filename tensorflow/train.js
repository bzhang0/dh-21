// import tensorflow js
const tf = require('@tensorflow/tfjs-node');
// import jquery csv
const jqueryCsv = require('jquery-csv');
// import fs
const fs = require('fs');

// the sequence length to parse
const sequenceLength = 100;

// the max number of rows to read
const LIMIT = 100;

// trains the model
async function start() {
    // get the training data from data
    console.log('Loading training data...');
    const [trainXs, trainYs, testXs, testYs, charMap] = await getTrainData();

    // create the model
    console.log('Creating model...');
    const model = createModel();
    model.summary();

    // train the model
    console.log('Training model...');
    await model.fit(trainXs, trainYs, {
        epochs: 50,
    });

    // save the model to disk
    console.log('Saving model...');
    await model.save('file://./model/');

    // save the charmap to the disk
    // write some info about the model to the disk
    console.log('Writing model parameters...');
    const info = {
        sequenceLength: sequenceLength,
        charMap: Object.fromEntries(charMap),
    };
    fs.writeFileSync('./model/info.json', JSON.stringify(info));

    // evaluate the model
    console.log('Evaluating model...');
    const testResult = await model.evaluate(testXs, testYs);
    console.log('Test loss: ');
    console.log(testResult[0].dataSync());
    console.log('Test accuracy: ');
    console.log(testResult[1].dataSync());
}

// creates a model with 3 dense layers
function createModel() {
    const model = tf.sequential();

    // first layer
    model.add(tf.layers.dense({
        inputShape: [sequenceLength],
        units: 32,
    }));

    // second layer
    model.add(tf.layers.dense({
        units: 32,
    }));

    // third layer
    model.add(tf.layers.dense({
        units: 1,
    }));

    // compile the model
    model.compile({
        optimizer: tf.train.adam(),
        loss: 'meanSquaredError',
        metrics: ['accuracy']
    });

    return model;
}

// returns Tensors to train
async function getTrainData() {
    // read csv files data/Fake.csv and data/True.csv
    const fakeData = await readCsv('data/Fake.csv');
    const trueData = await readCsv('data/True.csv');
    console.log('Read ' + fakeData.length + ' fake articles and ' + trueData.length + ' true articles');
  
    // extract headers from fakeData and trueData, and remove from data
    const fakeHeaders = fakeData.shift();
    const trueHeaders = trueData.shift();
  
    // add another column to fakeData to indicate it's fake
    fakeData.forEach(function(row) {
      row.push(0.0);
    });
  
    // add another column to trueData to indicate it's true
    trueData.forEach(function(row) {
      row.push(1.0);
    });
  
    // combine fakeData and trueData and shuffle
    let data = fakeData.concat(trueData);

    // remove any entries with text less than sequenceLength
    data.forEach(function(row) {
        if (row[1].length < sequenceLength) {
            row.splice(1, 1);
        }
    });

    // shuffle data array
    shuffle(data);

    // limit the data to the first LIMIT rows
    if (LIMIT > 0) {
        data = data.slice(0, LIMIT);
    }

    // create a character mapping for all text
    const charMap = new Map();
    data.forEach(row => {
        const text = row[1];
        text.split('').forEach(char => {
            if (!charMap.has(char)) {
                charMap.set(char, charMap.size);
            }
        });
    });
    
    // split data into train and test
    const trainData = data.slice(0, data.length * 0.8);
    const testData = data.slice(data.length * 0.8);
  
    // create tensors from trainData and testData
    const [trainXs, trainYs] = createTensors(trainData, charMap);
    const [testXs, testYs] = createTensors(testData, charMap);
  
    // return the tensors
    return [trainXs, trainYs, testXs, testYs, charMap];
}

// shuffles an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
  
// creates a tensor
function createTensors(data, charMap) {
    const xs = [];
    const ys = [];

    // for each row in data
    data.forEach(row => {
        // get the text, to lowercase, and remove punctuation
        const text = row[1].toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
        // take the first sequenceLength characters
        const sequence = text.substr(0, sequenceLength);
        // get the chars from the article text
        const chars = sequence.split('');
        // if chars isn't long enough, skip it
        if (chars.length < sequenceLength) {
            return;
        }
        const charNumbers = chars.map(char => charMap.get(char));
        // get the label
        const label = row[4];
        // print the numbers
        console.log(charNumbers);
        // create a tensor from the chars
        const x = tf.tensor(charNumbers, [sequenceLength], 'int32');
        // create a tensor from the label
        const y = tf.tensor1d([label], 'float32');

        // add the tensors to the xs and ys arrays
        xs.push(x);
        ys.push(y);
    });

    // return the xs and ys arrays
    return [tf.stack(xs), tf.stack(ys)];
}

// reads data from a csv file into an array
async function readCsv(file) {
    // read the file
    const data = fs.readFileSync(file, 'utf8');
    const arrays = jqueryCsv.toArrays(data);
    return arrays;
}

// start
start();

