'use strict';

import alfy from "alfy";
import Database from 'better-sqlite3';

// Database
const sqliteOptions = { readonly: true, fileMustExist: true };

// SQL
const TASK_SELECT = "t.persistentIdentifier AS id, t.name AS name, t.dateCompleted as date_completed, t.blockedByFutureStartDate AS blocked_by_future_start_date, p.name AS project_name, t.flagged as flagged, t.dateToStart AS date_to_start, t.inInbox AS in_inbox, t.effectiveInInbox AS effective_in_inbox, t.effectiveDateToStart AS effective_date_to_start, t.childrenCountAvailable AS child_count, t.blocked AS blocked, pi.status AS status, t.effectiveFlagged AS effective_flagged, t.dateModified AS date_modified, t.containingProjectInfo AS containing_project_info, t.dateDue AS due_date, t.effectiveContainingProjectInfoRemaining AS project_remaining"
const TASK_FROM  = "((task tt left join projectinfo pi on tt.containingprojectinfo=pi.pk) t left join task p on t.task=p.persistentIdentifier) "
const WHERE_SUFFIX = "(t.containingProjectInfo <> t.persistentIdentifier OR t.containingProjectInfo is NULL) "
const OPEN_TASK_LIKE = "t.dateCompleted IS NULL AND lower(t.name) LIKE lower('%"
const CLOSED_TASK_LIKE = "t.dateCompleted IS NOT NULL AND lower(t.name) LIKE lower('%"
const LIKE_SUFFIX = "%') AND "
const NAME_SORT  = "name ASC"
const PROJECT_SELECT = "p.pk AS id, t.name AS name, p.status AS status, p.numberOfAvailableTasks AS available_task_count, p.numberOfRemainingTasks AS remaining_task_count, p.containsSingletonActions AS singleton, f.name AS folder_name, t.dateToStart AS start_date, t.effectiveDateToStart AS effective_start_date"
const PROJECT_FROM = "(ProjectInfo p LEFT JOIN Task t ON p.task=t.persistentIdentifier) LEFT JOIN Folder f ON p.folder=f.persistentIdentifier"

function generateSQL(s, f, w, o) {
    return `SELECT ${s} FROM ${f} WHERE ${w} ORDER BY ${o}`
}

function runQuery(sql) {
    let dbPath = alfy.userConfig.get('dbPath');
    if (dbPath === undefined) {
        dbPath = "/Users/rhyd/Library/Group Containers/34YW5XSRB7.com.omnigroup.OmniFocus/com.omnigroup.OmniFocus3.MacAppStore/com.omnigroup.OmniFocusModel/OmniFocusDatabase.db"
    }

    const db = new Database(dbPath, sqliteOptions);

    try {
        console.log(`Running ${sql}`)
        const stmt = db.prepare(sql)
        const results = stmt.all()
        console.log(`Found ${results.length} results`)
        return results
    }
    catch (err) {
        alfy.error(err)
    }
    finally {
        db.close()
    }
}

export function searchTasks(query, completedOnly=null, flaggedOnly = null,
                            activeOnly=null, everything=null) {
    let whereClause = completedOnly ? (CLOSED_TASK_LIKE + query + LIKE_SUFFIX + WHERE_SUFFIX) :
        (OPEN_TASK_LIKE + query + LIKE_SUFFIX + WHERE_SUFFIX)
    if (flaggedOnly) whereClause = "(t.flagged = 1 OR t.effectiveFlagged = 1) AND " + whereClause
    if (activeOnly) whereClause = "(t.blocked = 0 AND t.blockedByFutureStartDate = 0) AND " + whereClause
    if (!everything) whereClause = "(t.effectiveInInbox = 0 AND t.inInbox = 0) AND " + whereClause

    let sql = generateSQL(TASK_SELECT, TASK_FROM, whereClause, `t.${NAME_SORT}`)
    return runQuery(sql)
}

export function searchProjects(query, activeOnly=null) {
    let whereClause = `lower(t.name) LIKE lower('%${query}%')`
    let orderBy = "p.containsSingletonActions DESC, t.name ASC"

    if (activeOnly) whereClause = "p.status = 'active' AND " + where

    let sql = generateSQL(PROJECT_SELECT, PROJECT_FROM, whereClause, orderBy)
    return runQuery(sql)
}