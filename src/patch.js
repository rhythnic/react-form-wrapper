import curry from 'lodash/fp/curry';
import get from 'lodash/fp/get';
import filter from 'lodash/filter';


export const modifyPatchWithEvent = curry(function modifyPatchWithEvent(isArray, patch, evt) {
  const { value, checked, type } = evt.target;

  patch.op = 'replace';

  switch(type) {
    case 'checkbox':
      if (isArray) {
        patch.op = checked ? 'add' : 'remove';
        patch.value = value;
      } else {
        patch.value = checked;
      }
      break;
    case 'select-multiple':
      patch.value = filter(evt.target.options, 'selected').map(o => o.value);
      break;
    case 'number':
      patch.value = value === '' ? null : parseInt(value, 10);
      break;
    case 'file':
      patch.value = evt.target.files;
      break;
    default:
      patch.value = value;
  }

  return patch;
});


export function buildPatch(path, flatPath) {
  return Object.defineProperties({}, {
    path: { value: path, enumerable: true },
    flatPath: { value: flatPath },
    isPatch: { value: true }
  });
}
