// Maps an array.
// This fn fits as many iterations as it can into a single frame.
export default function asyncMap(arr, cb, done) {
  let start;
  let result = [];

  function execute(arr, i, deferred) {
    if (deferred) {
      start = performance.now();
    }

    const item = arr[i];
    result[i] = cb(item, i);
    const current = performance.now();
    const duration = current - start;

    // This handles the loop being complete
    if (i === arr.length - 1) {
      done(result);
    } else {
      // If we are taking too long, then we defer.
      // 13 because each frame is 16ms, but we allow 3ms for other things per frame
      if (duration >= 13) {
        setTimeout(() => execute(arr, i + 1, true));
      }
      // Otherwise, we execute synchronously
      else {
        execute(arr, i + 1, false);
      }
    }
  }

  if (arr.length) {
    execute(arr, 0, true);
  } else {
    done(result);
  }
}
