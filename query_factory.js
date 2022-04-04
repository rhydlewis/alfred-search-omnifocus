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
const PROJECT_ORDER_BY = "p.containsSingletonActions DESC, t.name ASC"
const FOLDER_SELECT = "persistentIdentifier AS id, name as name"
const TAG_SELECT = "persistentIdentifier AS id, name AS name, allowsNextAction AS allows_next_action, availableTaskCount AS available_task_count"
const INBOX_WHERE = "(t.effectiveInInbox = 1 OR t.inInbox = 1)"

export function QueryException(message, context) {
    this.message = message
    this.context = context
    this.name = 'QueryException'
}

function generateSQL(s, f, w, o) {
    return `SELECT ${s} FROM ${f} WHERE ${w} ORDER BY ${o}`
}

function runQuery(sql) {
    let db = null
    const dbPath = alfy.config.get('dbPath');

    try {
        db = new Database(dbPath, sqliteOptions);
    }
    catch (err) {
        throw new QueryException(`Unable to connect to OmniFocus database (${err.message})`, dbPath)
    }

    try {
        return db.prepare(sql).all()
    }
    catch (err) {
        throw new QueryException(`Error running query (${err.message})`, sql)
    }
    finally {
        if (db !== null) db.close()
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
    if (activeOnly) whereClause = "p.status = 'active' AND " + whereClause

    let sql = generateSQL(PROJECT_SELECT, PROJECT_FROM, whereClause, PROJECT_ORDER_BY)
    return runQuery(sql)
}

export function searchFolders(query) {
    let whereClause = "(dateHidden is null AND effectiveDateHidden is null)"
    if (query) whereClause = whereClause + ` AND lower(name) LIKE lower('%${query}%')`
    let sql = generateSQL(FOLDER_SELECT, "Folder", whereClause, NAME_SORT)
    return runQuery(sql)
}

export function searchTags(query) {
    let sql = query === undefined ? `SELECT ${TAG_SELECT} FROM "Context" ORDER BY ${NAME_SORT}` :
        generateSQL(TAG_SELECT, "Context", `lower(name) LIKE lower('%${query}%')`, NAME_SORT)
    return runQuery(sql)
}

export function searchInbox(query) {
    let whereClause = query === undefined ? INBOX_WHERE : (OPEN_TASK_LIKE + query + LIKE_SUFFIX + INBOX_WHERE)
    let sql = generateSQL(TASK_SELECT, TASK_FROM, whereClause, "t." + NAME_SORT)
    return runQuery(sql)
}

export function searchNotes(query, activeOnly=null, flagged = null) {
    let selectNote = TASK_SELECT + ", t.plainTextNote"
    let whereClause = `t.dateCompleted IS NULL AND lower(t.plainTextNote) LIKE lower('%${query}%')`

    if (activeOnly) whereClause = whereClause + " AND (t.blocked = 0 AND t.blockedByFutureStartDate = 0)"
    if (flagged) whereClause = whereClause + " AND (t.flagged = 1 OR t.effectiveFlagged = 1)"

    let sql =  generateSQL(selectNote, TASK_FROM, whereClause, "t." + NAME_SORT)
    return runQuery(sql)
}