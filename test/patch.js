import test from 'tape';
import { buildPatchBase, modifyPatchWithEvent } from '../src/patch';
import { assign } from 'lodash';


const buildPatch = function(){
  const path = [ [ 'a' ] ];
  const flatPath = [ 'a' ];
  return function() {
    return buildPatchBase(path, flatPath);
  }
}();


function buildEvent(type, value, checked) {
  return { target: { type, value, checked } };
}


test('buildPatch', function(t) {
  const patch = buildPatch();
  const patchKeys = Object.keys(patch);
  t.equal(patchKeys.length, 1, "Has one enumerable property");
  t.equal(patchKeys[0], 'path', "Path is enumerable");
  t.equal(patch.isPatch, true, "isPatch prop is true.");
  t.end();
});


test('modifyPatchWithEvent isArray=false', function(t) {
  const modify = modifyPatchWithEvent(false);

  let evt = buildEvent('text', 'b');
  let expected = assign(buildPatch(), { op: 'replace', value: 'b' });
  t.deepEqual(modify(buildPatch(), evt), expected, "Default: sets patch value to event.target.value");

  evt = buildEvent('checkbox', '', true);
  expected = assign(buildPatch(), { op: 'replace', value: evt.target.checked });
  t.deepEqual(modify(buildPatch(), evt), expected, "Checkbox: sets value to event.checked");

  evt = buildEvent('select-multiple');
  assign(evt.target, { options: [
    { value: 'a', selected: true },
    { value: 'b', selected: false },
    { value: 'c', selected: true }
  ]});
  expected = assign(buildPatch(), { op: 'replace', value: ['a', 'c'] })
  t.deepEqual(modify(buildPatch(), evt), expected, "Select-multiple: sets value to array of selected options.");

  evt = buildEvent('number', '5');
  expected = assign(buildPatch(), { op: 'replace', value: 5 });
  t.deepEqual(modify(buildPatch(), evt), expected, "Number: converts string to number");

  evt = buildEvent('number', '');
  expected = assign(buildPatch(), { op: 'replace', value: null });
  t.deepEqual(modify(buildPatch(), evt), expected, "Number: uses null for empty string value.");

  evt = buildEvent('file');
  const files = {};
  assign(evt.target, { files });
  expected = assign(buildPatch(), { op: 'replace', value: files });
  t.deepEqual(modify(buildPatch(), evt), expected, "File: sets value to evt.target.files");

  t.end();
});


test('modifyPatchWithEvent isArray=true', function(t) {
  const modify = modifyPatchWithEvent(true);

  let evt = buildEvent('checkbox', 'item', true);
  let expected = assign(buildPatch(), { op: 'add', value: evt.target.value });
  t.deepEqual(modify(buildPatch(), evt), expected, "Checkbox: checked is true, makes patch to add item to list.");

  evt = buildEvent('checkbox', 'item', false);
  expected = assign(buildPatch(), { op: 'remove', value: evt.target.value });
  t.deepEqual(modify(buildPatch(), evt), expected, "Checkbox: checked is false, makes patch to remove item from list.");

  t.end();
});
