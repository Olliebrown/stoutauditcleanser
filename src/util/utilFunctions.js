// Generic function to wait
export function wait (timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve() }, timeout)
  })
}
