'use strict';

import alfy from 'alfy';
import {searchTasks, searchProjects} from "./query_factory.js";
import {listPerspectives} from "./omnifocus.js";
import {createTask, createProject} from "./result_factory.js"

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
const PROJECT = 'p'

function main() {
	let results = undefined
	switch (argv.type) {
		case PERSPECTIVE:
			perspectiveQuery(argv.query);
			break;
		case TASK:
			results = searchTasks(argv.query, argv.completedOnly, argv.flaggedOnly, argv.activeOnly, argv.everything);
			break;
		case PROJECT:
			results = searchProjects(argv.query, argv.activeOnly);
			break;
	}
	if (results !== undefined) outputResults(results)
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
	}
	else {
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
			case TASK:
				results.forEach(result => { items.push(createTask(result)) })
				break;
			case PROJECT:
				results.forEach(result => { items.push(createProject(result)) })
		}
	}

	alfy.output(items)
}

main()
