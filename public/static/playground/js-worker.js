/*
 * JavaScript playground runner. Runs one program per worker so a stuck loop can be killed
 * with worker.terminate(). Messages out: { type: 'out' | 'err' | 'done', text }.
 */
'use strict'

function inspect(value, depth, seen) {
  if (typeof value === 'string') return depth === 0 ? value : JSON.stringify(value)
  if (typeof value === 'bigint') return value + 'n'
  if (typeof value === 'symbol') return value.toString()
  if (typeof value === 'function') return '[Function ' + (value.name || 'anonymous') + ']'
  if (value === undefined) return 'undefined'
  if (value === null || typeof value !== 'object') return String(value)
  if (value instanceof Error) return value.name + ': ' + value.message
  if (value instanceof Date) return value.toISOString()
  if (value instanceof RegExp) return String(value)
  if (seen.indexOf(value) >= 0) return '[Circular]'
  if (depth > 4) return Array.isArray(value) ? '[Array]' : '[Object]'
  seen = seen.concat([value])
  var next = function (v) {
    return inspect(v, depth + 1, seen)
  }
  if (Array.isArray(value)) return '[ ' + value.map(next).join(', ') + ' ]'
  if (value instanceof Map) {
    var m = []
    value.forEach(function (v, k) {
      m.push(next(k) + ' => ' + next(v))
    })
    return 'Map(' + value.size + ') { ' + m.join(', ') + ' }'
  }
  if (value instanceof Set) {
    var s = []
    value.forEach(function (v) {
      s.push(next(v))
    })
    return 'Set(' + value.size + ') { ' + s.join(', ') + ' }'
  }
  var keys = Object.keys(value)
  var name = value.constructor && value.constructor !== Object ? value.constructor.name + ' ' : ''
  if (!keys.length) return name + '{}'
  return (
    name +
    '{ ' +
    keys
      .map(function (k) {
        return (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)) + ': ' + next(value[k])
      })
      .join(', ') +
    ' }'
  )
}

function send(type, args) {
  var text = Array.prototype.map
    .call(args, function (a) {
      return inspect(a, 0, [])
    })
    .join(' ')
  self.postMessage({ type: type, text: text })
}

function errorText(e) {
  return e && e.name ? e.name + ': ' + e.message : 'Uncaught ' + inspect(e, 1, [])
}

console.log =
  console.info =
  console.debug =
    function () {
      send('out', arguments)
    }
console.warn = console.error = function () {
  send('err', arguments)
}
console.table = function (data) {
  send('out', [data])
}

self.addEventListener('unhandledrejection', function (e) {
  self.postMessage({ type: 'err', text: 'Uncaught (in promise) ' + errorText(e.reason) })
})
self.addEventListener('error', function (e) {
  self.postMessage({ type: 'err', text: e.message })
})

var AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

self.onmessage = function (e) {
  var program
  try {
    program = new AsyncFunction(e.data.code)
  } catch (err) {
    self.postMessage({ type: 'err', text: errorText(err) })
    self.postMessage({ type: 'done' })
    return
  }
  program().then(
    function () {
      self.postMessage({ type: 'done' })
    },
    function (err) {
      self.postMessage({ type: 'err', text: errorText(err) })
      self.postMessage({ type: 'done' })
    }
  )
}
