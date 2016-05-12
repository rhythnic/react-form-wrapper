export function setData(data) {
  return {
    type: 'SET_DATA',
    data
  }
}

export function updateForm(patch) {
  return {
    type: 'UPDATE_FORM',
    patch
  }
}

export function resetForm() {
  return {
    type: 'RESET_FORM'
  }
}
