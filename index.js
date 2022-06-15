'use strict';

import alfy from 'alfy';
import {searchTasks, searchProjects, searchFolders, searchTags, searchInbox, searchNotes} from "./query_factory.js";
import {listPerspectives} from "./omnifocus.js";
import {createTask, createProject, createFolder, createTag} from "./result_factory.js"

import yargs from 'yargs'
import {hideBin} from "yargs/helpers";

const argv = yargs(hideBin(process.argv)).argv

const NO_RESULTS = [{
    icon: {
        path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertNoteIcon.icns"
    },
    title: "No results"
}]

const PERSPECTIVE = 'v'
const TASK = 't'
const PROJECT = 'p'
const FOLDER = 'f'
const TAG = 'c'
const INBOX = 'i'
const NOTE = 'n'
const SINGLE_QUOTE = "'"
const ESC_SINGLE_QUOTE = "''"

function main() {
    if (alfy.config.get('dbPath') === undefined) {
        alfy.output(createError("'dbPath' is missing", "Use get-of-db and set-of-db keywords"))
    } else {
        runWorkflow()
    }
}

function runWorkflow() {
    let results = undefined
    let query = '' + argv.query // Fix for a numerical query since following line fails when running .includes
    if (query !== undefined && query.includes(SINGLE_QUOTE)) {
        query = query.replaceAll(SINGLE_QUOTE, ESC_SINGLE_QUOTE)
    }

    try {
        switch (argv.type) {
            case PERSPECTIVE:
                perspectiveQuery(query);
                break;
            case TASK:
                results = searchTasks(query, argv.completedOnly, argv.flaggedOnly, argv.activeOnly, argv.everything);
                break;
            case PROJECT:
                results = searchProjects(query, argv.activeOnly);
                break;
            case FOLDER:
                results = searchFolders(query);
                break;
            case TAG:
                results = searchTags(query);
                break;
            case INBOX:
                results = searchInbox(query);
                break;
            case NOTE:
                results = searchNotes(query, argv.activeOnly, argv.flaggedOnly);
                break;
        }

        if (results !== undefined) {
            outputResults(results)
        }
    }
    catch (e) {
        alfy.output(createError(e.message, e.context))
    }
}

function perspectiveQuery(query) {
    if (query) {
        listPerspectives().then(perspectives => {
            alfy.output(perspectives.filter(function (item) {
                if (item.title.toLowerCase().indexOf(argv.query.toLowerCase()) >= 0) {
                    return {title: item.title, subtitle: item.subtitle, icon: item.icon}
                }
            }))
        })
    } else {
        listPerspectives().then(perspectives => {
            alfy.output(perspectives)
        })
    }
}

function outputResults(results) {
    let items = NO_RESULTS

    if (results !== null && results.length > 0) {
        items = []
        switch (argv.type) {
            case PROJECT:
                results.forEach(result => {
                    items.push(createProject(result))
                })
                break;
            case FOLDER:
                results.forEach(result => {
                    items.push(createFolder(result))
                })
                break;
            case TAG:
                results.forEach(result => {
                    items.push(createTag(result))
                })
                break;
            default: // Search task, search inbox
                results.forEach(result => {
                    items.push(createTask(result))
                })
        }
    }

    alfy.output(items)
}

function createError(title, subtitle) {
    return [{
        icon: {
            path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns"
        },
        title: title,
        subtitle: subtitle
    }]
}

main()
