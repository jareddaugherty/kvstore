#! /usr/bin/env node

const readline = require('readline')
const msgpack = require('msgpack5')
const levelup = require('level')

const { encode, decode } = msgpack()

const db = levelup('./keystore.db')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'kv> '
})

function displayUsage() {
    console.log(`
      Usage:
        set <key>=<value>
        get <key>
    `)
    rl.prompt()
}

function get(key) {
    db.get(key, function (err, value) {
      if (err) {
        console.log('Error: ', err.message)
      } else {
        console.log(`{ ${key}: ${value} }`)
      }
      rl.prompt()
    })
}

function set(key, value) {
    db.put(key, value, function (err) {
      if (err) return console.log(err.message)
      rl.prompt()
    })

}

function onLine(line) {
    const input = line.split(' ')
    const command = input[0]
    const args = input.slice(1)
    switch (command) {
        case 'set':
            const pair = args[args.length - 1] || ''
            const [key = '', value = ''] = pair.split('=')

            !key.length ? displayUsage() : set(key, value)
            rl.prompt()
            break
        case 'get':
            args[0] !== undefined ? get(args[0]) : console.log('Key not found\n')
            break
        default:
            displayUsage()
            break
    }
}


function main() {
  rl.prompt()
  rl.on('line', (line) => onLine(line))
}

main()
