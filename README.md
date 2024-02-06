# alfred-search-omnifocus

## What is this?

This is a workflow for [Alfred](http://www.alfredapp.com/) that performs free text searches
on [OmniFocus](http://www.omnigroup.com/omnifocus) data.

## Doesn't something like this already exist?

Yes! This workflow is based on [the Search Omnifocus workflow](https://github.com/rhydlewis/search-omnifocus)
which [no longer works](https://www.alfredapp.com/help/kb/python-2-monterey/) with the latest version of macOS. This is
a rewrite in Javascript and uses [Alfy](https://github.com/sindresorhus/alfy) to do the heavy lifting.

## Why would I want such a thing?

Well, I want it because I can't quickly search for, say, a task within OmniFocus using OmniFocus' search field.
OmniFocus restricts search results to the current perspective or
selection. [Other people have noticed this too](https://discourse.omnigroup.com/t/how-to-search-all-content-a-via-changed-perspective/366)
.

## How to install

**Pre-requisites**

This workflow relies on Node.js.
Follow [these instructions to install](https://treehouse.github.io/installation-guides/mac/node-mac.html).

1. Install the workflow using `npm`

    `npm install --global alfred-search-omnifocus`

2. Open Alfred Preferences (`alf`) and - if you have the old version of the workflow installed - disable the existing
   workflow "Search Omnifocus" by right clicking on it and unchecking Enabled
3. Run Alfred command `find-of-db` to copy the path of the Omnifocus database to your clipboard. If you have both Omnifocus 3 and Omnifocus 4 installed you will get both paths on your clipboard, and you need to paste the paths somewhere and choose which one you want.
4. Run Alfred command `set-of-db` and then paste (⌘-V) the database path as an argument

> Note, if you're using `zsh`, `fish` or another shell, type `bash` before step 1 to ensure that you install the workflow using the system node.js installation

## Troubleshooting

> I'm seeing errors in the Alfred log related to NODE_MODULE_VERSION or better-sqlite3?

Yes, this has been a pain to resolve. Try this to fix:

1. Open Alfred preferences
2. Right click on the **Search OmniFocus JS workflow** and choose **Open in Terminal**
3. Check that you're using the correct version of node as used by Alfred (as of writing `v18.12.1`)
    `bash`
    `node -v`
4. In your Terminal app - _in the Alfred workflow folder opened in the step before!_ - remove the `node_modules` folder then install the correct packages for your environment by following these commands:
    `rm -rf node_modules/`
    `npm install`
4. Then retry the worfklow

It has also been reported that installing Xcode can resolve this issue.


> Hang on? Why do I have to type `bash`?

Alfred runs the workflow runs from the macOS installed version of bash (/bin/bash) so the workflow version of node.js expects packages that the workflow depends on to be built for the macOS version of node.

## How to use

## Note

This workflow only works with OmniFocus 3 and OmniFocus 4.

### Searching for tasks

* Search for all tasks within OmniFocus (irrespective of status) with `.s`:

![](./images/search-for-tasks.png)

Note, use `.sc` to search for completed tasks only.

![](./images/search-for-completed-tasks.png)

### Searching for tasks in the Inbox and the Library

* Search for all tasks within OmniFocus (whether you've processed them or not) with `.se`.

### Searching the inbox

* Search the OmniFocus inbox with `.i`:

![](./images/search-inbox.png)

or just list all tasks in the inbox with `.li`.

### Searching for projects

* Search for projects with `.p`:

![](./images/search-for-project.png)

### Searching for tags or contexts

* Search for a specific tag with `.t` or context with `.c`:

![](./images/search-for-tag.png)
![](./images/search-for-context.png)

or just list all tags with `.lt` or contexts with `.lc`:

![](./images/list-tags.png)

* Search for a specific context with `.c`:

### Searching for perspectives

* Search for a specific perspective with `.v`:

![](./images/search-for-perspectives.png)

or just list all perspectives with `.lv`:

![](./images/list-perspectives.png)

### Searching for folders

* Search for a specific folder with `.f`:

![](./images/search-for-folders.png)

or just list all folders with `.lf`:

![](./images/list-folders.png)

### Searching for task or projects notes

* Search for a specific note in a task or project with `.n`:

![](./images/search-note.png)

* Search for a specific note in a flagged task `.ng`
* Search for a specific note in active task `.na`

### Narrowing results

* Search just for *active* tasks with `.sa`:

![](./images/search-for-active-tasks.png)

or just for *active* projects with `.pa`:

![](./images/search-for-active-projects.png)

* Search all *flagged* tasks with `.g`:

![](./images/search-for-flagged-tasks.png)

or for *flagged* and *active* tasks with `.ga`:

![](./images/search-for-flagged-active-tasks.png)

* **Not supported yet** Show the 10 most recently modified tasks with `.r`:

![](./images/show-recent-tasks.png)

or show the 10 most recently modfified and non-completed tasks or projects with `.ra`:

![](./images/show-recent-active-tasks.png)

* **Not supported yet** Show overdue or due items with `.d`:

![](./images/overdue-tasks.png)

## Thanks to...

* [Sindre Sorhus](https://github.com/sindresorhus): for
  providing [Alfy, the JS library for Alfred workflows](https://github.com/sindresorhus/alfy)
* [Marko Kaestner](https://github.com/markokaestner): I used
  the [in-depth workflow](https://github.com/markokaestner/of-task-actions) to provide some insight into how to search
  Omnifocus.
* [Danny Smith](https://github.com/dannysmith): for providing a new, and quite frankly, much improved workflow icon.

