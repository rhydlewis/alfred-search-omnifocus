'use strict';

import applescript from 'applescript';
import alfy from 'alfy';
import {DEFAULT_PERSPECTIVE_ICONS, DEFAULT_PERSPECTIVES, PERSPECTIVE_ICON} from "./constants.js"

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
        iconPath = DEFAULT_PERSPECTIVE_ICONS[name]
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
