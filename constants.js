// Icons
export const DROPPED_ICON = './icons/dropped.png'
export const FLAGGED_ICON = './icons/flagged.png'
export const ON_HOLD_ICON = './icons/on-hold.png'
export const ACTIVE_ICON = './icons/active.png'
export const COMPLETED_ICON = './icons/completed.png'
export const INBOX_ICON = './icons/inbox.png'
export const DEFERRED_ICON = './icons/deferred.png'
export const FOLDER_ICON = './icons/folder.png'
export const TAG_ICON = './icons/tag.png'
export const PROJECTS_ICON = './icons/projects.png'
export const FORECAST_ICON = './icons/forecast.png'
export const REVIEW_ICON = './icons/review.png'
export const PERSPECTIVE_ICON = './icons/perspective.png'

// Perspectives
const INBOX = 'Inbox'
const PROJECTS = 'Projects'
const TAGS = 'Tags'
const FORECAST = 'Forecast'
const FLAGGED = 'Flagged'
const REVIEW = 'Review'

export const DEFAULT_PERSPECTIVES = [INBOX, PROJECTS, TAGS, FORECAST, FLAGGED, REVIEW]
export const DEFAULT_PERSPECTIVE_ICONS = {
    [INBOX]: INBOX_ICON,
    [PROJECTS]: PROJECTS_ICON,
    [TAGS]: TAG_ICON,
    [FORECAST]: FORECAST_ICON,
    [FLAGGED]: FLAGGED_ICON,
    [REVIEW]: REVIEW_ICON
}