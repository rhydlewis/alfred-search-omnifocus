'use strict';

import yargs from 'yargs'
import {hideBin} from "yargs/helpers";
import alfy from "alfy";
const argv = yargs(hideBin(process.argv)).argv

let oldPath = alfy.config.get('dbPath')

if (argv.get) {
    console.log(oldPath)
} else if (argv.set) {
    let newPath = argv.set
    if (newPath !== undefined) {
        // console.log(`set path from '${oldPath}' to '${newPath}'`)
        alfy.config.set('dbPath', newPath)
        console.log(newPath)
    }
}