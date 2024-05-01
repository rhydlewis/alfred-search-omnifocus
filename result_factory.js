import {parseISO} from "date-fns";

import {ACTIVE_ICON, COMPLETED_ICON, INBOX_ICON, ON_HOLD_ICON, DEFERRED_ICON, DROPPED_ICON, FOLDER_ICON} from "./constants.js"

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

export function createTag(result) {
    let iconPath = ACTIVE_ICON

    let allowsNextAction = result["allows_next_action"]
    let availableTasks = result["available_task_count"]
    let subtitle = availableTasks === 1 ? "1 task available" : `${availableTasks} tasks available`

    if (allowsNextAction === 0) iconPath = ON_HOLD_ICON

    return {
        icon: {
            path: iconPath
        },
        title: result["name"],
        subtitle: subtitle,
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
