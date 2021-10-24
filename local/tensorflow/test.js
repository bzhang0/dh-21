// require predict
const model = require('./predict');

async function test() {
    console.log('Testing...')
    const result = await model.predict('some words go here');
    console.log(result);
}
test();