// This guards against browsers that don't support localStorage, although
// that is pretty unlikely.

function localStorageTest() {
  var test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

const hasLocalStorage = localStorageTest();

export function setItem(...args) {
  if (!hasLocalStorage) {
    return;
  }

  return localStorage.setItem(...args);
}

export function getItem(...args) {
  if (!hasLocalStorage) {
    return;
  }

  return localStorage.getItem(...args);
}
