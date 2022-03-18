import path from 'path'
import {OF_ICON_ROOT} from "./omnifocus.js"
import {parseISO} from "date-fns";

const DROPPED_ICON = path.join(OF_ICON_ROOT, 'dropped@2x.png')
const FLAGGED_ICON = path.join(OF_ICON_ROOT, 'flagged@2x.png')
const ON_HOLD_ICON = path.join(OF_ICON_ROOT, 'on-hold@2x.png')
const ACTIVE_ICON = path.join(OF_ICON_ROOT, 'active-small@2x.png')
const COMPLETED_ICON = path.join(OF_ICON_ROOT, 'completed@2x.png')
const INBOX_ICON = path.join(OF_ICON_ROOT, 'inbox-sidebar@2x.png')
const PERSPECTIVE_ICON = path.join(OF_ICON_ROOT, 'Perspectives@2x.png')
const DEFERRED_ICON = path.join("./", 'deferred.png')
const FOLDER_ICON = path.join(OF_ICON_ROOT, 'quickopen-folder@2x.png')

const STATUS_ACTIVE = 'active'

// const DATETIME_FORMAT = 'yyyy-MM-dd[T]HH:mm:ss.ttt'
const DATETIME_OFFSET = 978307200

export function createTask(result) {
    let iconPath = ACTIVE_ICON
    let dateCompleted = result["date_completed"]
    let projectName = result["project_name"]
    let blockedByFutureDate = result["blocked_by_future_start_date"] === 1
    let blocked = result["blocked"] === 1
    let childCount = result["child_count"]
    let parentStatus = result["status"]
    let inboxTask = (result["in_inbox"] === 1 || result["effective_in_inbox"] === 1)
    // let effectiveStartDate =  result["effective_date_to_start"]
    // let startDate = result["date_to_start"]
    // let actualStartDate = effectiveStartDate === 0 ? startDate : effectiveStartDate

    if (dateCompleted) iconPath = COMPLETED_ICON
    else if (inboxTask) {
        iconPath = INBOX_ICON
        projectName = "Inbox"
    }
    else if (blockedByFutureDate || (blocked && !childCount) || parentStatus !== STATUS_ACTIVE) iconPath = ON_HOLD_ICON
    // else if (isDeferred(actualStartDate)) iconPath = DEFERRED_ICON

    return {
        icon: {
            path: iconPath
        },
        title: result["name"],
        subtitle: projectName,
        arg: result["id"]
    }
}

export function createProject(result) {
    let status = result["status"]
    let folderName = result["folder_name"]
    let startDate = result['start_date']

    let iconPath = ACTIVE_ICON
    switch (status) {
        case 'done':
            iconPath = COMPLETED_ICON;
            break;
        case 'dropped':
            iconPath = DROPPED_ICON;
            break;
        case 'inactive':
            iconPath = ON_HOLD_ICON;
            break;
    }

    if (status === 'active' && startDate !== null && isDeferred(startDate)) iconPath = DEFERRED_ICON

    return {
        icon: {
            path: iconPath
        },
        title: result["name"],
        subtitle: folderName,
        arg: result["id"]
    }
}


export function createFolder(result) {
    let iconPath = FOLDER_ICON

    return {
        icon: {
            path: iconPath
        },
        title: result["name"],
        subtitle: '',
        arg: result["id"]
    }
}

function isDeferred(actualStartDate) {
    let pdt = parseDatetime(actualStartDate)
    return (pdt !== null && pdt > Date.now())
}

function parseDatetime(dt) {
    try {
        return parseISO(dt)
    }
    catch (error) {
        return null
    }
}
