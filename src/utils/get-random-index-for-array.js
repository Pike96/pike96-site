// @flow strict
const getRandomItemFromArray = (array) => (array && array.length
  ? array[Math.floor(Math.random() * array.length)]
  : null);

export default getRandomItemFromArray;