'use strict';

import applescript from 'applescript';
import path from 'path'
import alfy from "alfy";

const INBOX = 'Inbox'
const PROJECTS = 'Projects'
const TAGS = 'Tags'
const FORECAST = 'Forecast'
const FLAGGED = 'Flagged'
const REVIEW = 'Review'

const DEFAULT_PERSPECTIVES = [INBOX, PROJECTS, TAGS, FORECAST, FLAGGED, REVIEW]

// Icons
export const OF_ICON_ROOT = "/Applications/OmniFocus.app/Contents/Resources"
const DEFAULT_PERSPECTIVE_ICON = path.join(OF_ICON_ROOT, 'AppIcon-Credits.png')
const PERSPECTIVE_ICON = path.join(OF_ICON_ROOT, 'Perspectives@2x.png')

// Applescript
const PERSPECTIVE_SEARCH_SCRIPT = `tell application "OmniFocus"
  try
    return every perspective's name
  end try
end tell`

export async function listPerspectives() {
    const result = await runScript(PERSPECTIVE_SEARCH_SCRIPT)
    return DEFAULT_PERSPECTIVES.concat(result).map(x => createPerspective(x))
}

function runScript(script) {
    return new Promise((resolve, reject) => {
        applescript.execString(script, function (err, names) {
            if (err) reject(err);
            if (Array.isArray(names)) {
                let plist = []
                names.forEach(function (name) {
                    if (name !== "missing value" && name !== null) {
                        plist.push(name)
                    }
                });
                resolve(plist)
            }
        });
    });
}

function createPerspective(name) {
    let iconPath = PERSPECTIVE_ICON
    let perspectiveType = 'Custom'
    if (DEFAULT_PERSPECTIVES.includes(name)) {
        iconPath = DEFAULT_PERSPECTIVE_ICON
        perspectiveType = 'Default'
    }

    return {
        title: name,
        arg: name,
        icon: {
            path: iconPath
        },
        subtitle: `Omnifocus ${perspectiveType} Perspective`
    }
}
