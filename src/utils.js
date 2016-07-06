import curry from 'lodash/fp/curry';

export const JSPropNotationToArray = curry(
  function JSPropNotationToArray(pathArrayRegExp, delimiter, name) {
    return name.split(delimiter).reduce((path, key) => {
      let match = pathArrayRegExp.exec(key);
      path.push(match ? [ key.slice(0, match.index) ] : key);
      if (match && match[1]) {
        path.push(match[1]);
      }
      return path;
    }, []);
  }
);


const PATH_ARRAY_RE = /\[([\d]*)\]/;

export const buildPath = JSPropNotationToArray(PATH_ARRAY_RE);
