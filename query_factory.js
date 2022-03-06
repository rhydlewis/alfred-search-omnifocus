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
        // alfy.log(`Running ${sql}`)
        const stmt = db.prepare(sql)
        const results = stmt.all()
        // alfy.log(`Found ${results.length} results`)
        return results
    }
    catch (err) {
        alfy.error(err)
    }
    finally {
        db.close()
    }
}

export function searchTasks(query, completed_only=null) {
    let whereClause = completed_only ? (CLOSED_TASK_LIKE + query + LIKE_SUFFIX + WHERE_SUFFIX) :
        (OPEN_TASK_LIKE + query + LIKE_SUFFIX + WHERE_SUFFIX)
    let sql = generateSQL(TASK_SELECT, TASK_FROM, whereClause, `t.${NAME_SORT}`)
    return runQuery(sql)
}

/*
def search_tasks(active_only, flagged, query, everything=None, completed_only=None):
    if active_only:
        where = "(t.blocked = 0 AND t.blockedByFutureStartDate = 0) AND " + where

    if flagged:
        where = "(t.flagged = 1 OR t.effectiveFlagged = 1) AND " + where

    if not everything:
        where = "(t.effectiveInInbox = 0 AND t.inInbox = 0) AND " + where

    return _generate_query(TASK_SELECT, TASK_FROM, where, "t." + NAME_SORT)

 */

// let sql = generateSQL(TASK_SELECT, TASK_FROM, (OPEN_TASK_LIKE + "guit" + LIKE_SUFFIX + WHERE_SUFFIX), `t.${NAME_SORT}`)
// // let sql = generateSQL("count(*)", "Task t", "lower(t.name) LIKE lower('%guit%')", "t.name ASC")
// let results = runQuery(sql)