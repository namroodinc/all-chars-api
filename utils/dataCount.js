import { flattenDeep } from 'lodash';

export default function(data, key) {
  const flattenDeepArray = flattenDeep(data.map(item => {
    return item[key];
  }));

  const keyCount = Object.create(null);
  flattenDeepArray.forEach(key => {
    keyCount[key.prettyName] = keyCount[key.prettyName] ? keyCount[key.prettyName] + 1 : 1;
  });

  var sortable = [];
  for (var item in keyCount) {
    sortable.push({
      label: item,
      count: keyCount[item]
    });
  }
  sortable.sort((a, b) => b.count - a.count);

  return sortable;
}
