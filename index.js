'use strict';

import alfy from 'alfy';
import {searchTasks} from "./query_factory.js";
import {listPerspectives} from "./omnifocus.js";

import yargs from 'yargs'
import { hideBin } from "yargs/helpers";
const argv = yargs(hideBin(process.argv)).argv
const NO_RESULTS = [{
	icon: {
		path: alfy.icon.warning,
	},
	title: "No results"
}]

const PERSPECTIVE = 'v'
const TASK = 't'

function main() {
	if (argv.type !== PERSPECTIVE) {
		let results = searchTasks(argv.query)
		outputResults(results)
	}
	else {
		if (argv.query) {
			listPerspectives().then(perspectives => {
				alfy.output(perspectives.filter(function (item) {
					return item.title.toLowerCase().indexOf(argv.query.toLowerCase()) >= 0;
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
	if not results:
        wf.add_item('No items', icon=ICON_WARNING)
    else:
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

	if (results !== undefined && results.length > 0) {
		// create results
		// alfy.output(results.filter(function (item) {
		// 	return item.title.toLowerCase().indexOf(argv.query.toLowerCase()) >= 0;
		// }))
	}

	alfy.output(items)
}

main()
