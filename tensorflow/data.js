// export a function that returns a Tensor
// that contains the data
export default function getData() {
  return tf.tensor2d([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
  ], [4, 2]);
}