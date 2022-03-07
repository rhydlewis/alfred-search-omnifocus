'use strict';

import alfy from 'alfy';
import {searchTasks} from "./query_factory.js";
import {listPerspectives} from "./omnifocus.js";
import {createTask} from "./result_factory.js"

import yargs from 'yargs'
import { hideBin } from "yargs/helpers";
const argv = yargs(hideBin(process.argv)).argv

const NO_RESULTS = [{
	icon: {
		path: "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertNoteIcon.icns"
	},
	title: "No results"
}]

const PERSPECTIVE = 'v'
const TASK = 't'

function main() {
	if (argv.type !== PERSPECTIVE) {
		let results = searchTasks(argv.query, argv.completedOnly, argv.flaggedOnly, argv.activeOnly, argv.everything)
		outputResults(results)
	}
	else {
		if (argv.query) {
			listPerspectives().then(perspectives => {
				alfy.output(perspectives.filter(function (item) {
					if (item.title.toLowerCase().indexOf(argv.query.toLowerCase()) >= 0) {
						return {title: item.title, subtitle: item.subtitle, icon: item.icon}
					}
				}))
			})
		}
		else {
			listPerspectives().then(perspectives => {
				alfy.output(perspectives)
			})
		}
	}
}

function outputResults(results) {
	/*
        for result in results:
            if query_type == PROJECT:
                item = factory.create_project(result)
            elif query_type == CONTEXT:
                item = factory.create_context(result)
            elif query_type == FOLDER:
                item = factory.create_folder(result)
            elif query_type == RECENT:
                item = factory.create_recent_item(result)
            else:
                item = factory.create_task(result)
            log.debug(item)
            wf.add_item(title=item.name, subtitle=item.subtitle, icon=item.icon,
                              arg=item.persistent_id, valid=True)
	 */

	let items = NO_RESULTS

	if (results !== null && results.length > 0) {
		items = []
		if (argv.type === TASK) {
			results.forEach(result => { items.push(createTask(result)) })
		}
	}

	alfy.output(items)
}

main()
