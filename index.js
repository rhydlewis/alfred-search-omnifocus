'use strict';

import alfy from 'alfy';
import {searchTasks, searchProjects, searchFolders} from "./query_factory.js";
import {listPerspectives} from "./omnifocus.js";
import {createTask, createProject, createFolder} from "./result_factory.js"

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
const FOLDER = 'f'

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
		case FOLDER:
			results = searchFolders(argv.query);
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
				break;
			case FOLDER:
				results.forEach(result => { items.push(createFolder(result)) })
				break;
		}
	}

	alfy.output(items)
}

main()
