// @flow strict
const getRandomItemFromStrArray = (array: string[]) => (array && array.length
  ? array[Math.floor(Math.random() * array.length)]
  : null);

export default getRandomItemFromStrArray;