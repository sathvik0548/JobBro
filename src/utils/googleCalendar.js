/**
 * Google Calendar integration via URL scheme.
 * No OAuth or API keys required — opens Google Calendar in a new tab
 * with a pre-filled event that the user can save with one click.
 */

/**
 * Format a date string (YYYY-MM-DD) to Google Calendar date format (YYYYMMDD)
 */
function formatDate(dateStr) {
    return dateStr.replace(/-/g, '');
}

/**
 * Format a date string to the next day (for all-day event end date)
 */
function nextDay(dateStr) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0].replace(/-/g, '');
}

/**
 * Open Google Calendar with a pre-filled event for a job deadline reminder.
 * Used by students when viewing a job listing.
 */
export function addDeadlineToCalendar(job) {
    const start = formatDate(job.deadline);
    const end = nextDay(job.deadline);

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `📋 Application Deadline: ${job.title} @ ${job.company}`,
        dates: `${start}/${end}`,
        details: [
            `Job: ${job.title}`,
            `Company: ${job.company}`,
            `Location: ${job.location}`,
            `CTC: ${job.ctc}`,
            `Type: ${job.type}`,
            ``,
            `⚠️ This is the LAST DATE to apply for this position on PlacementHub.`,
            ``,
            `Branches: ${job.branches.join(', ')}`,
            `Min CGPA: ${job.minCGPA}`,
            `Skills Required: ${(job.skills || []).join(', ')}`,
        ].join('\n'),
        location: job.location,
    });

    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
}

/**
 * Open Google Calendar with a pre-filled event for a placement drive / interview date.
 * Used by admins when posting or managing jobs.
 */
export function addDriveToCalendar(job, driveDate, driveDetails = '') {
    const dateToUse = driveDate || job.deadline;
    const start = formatDate(dateToUse);
    const end = nextDay(dateToUse);

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `🏢 Placement Drive: ${job.company} — ${job.title}`,
        dates: `${start}/${end}`,
        details: [
            `Company: ${job.company}`,
            `Role: ${job.title}`,
            `Location: ${job.location}`,
            `CTC: ${job.ctc}`,
            driveDetails ? `Notes: ${driveDetails}` : '',
            ``,
            `Eligible Branches: ${job.branches.join(', ')}`,
            `Min CGPA: ${job.minCGPA}`,
        ].filter(Boolean).join('\n'),
        location: job.location,
    });

    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
}

/**
 * Build a shareable Google Calendar event link (no window.open).
 * Useful for displaying as a link or QR.
 */
export function buildCalendarUrl(job) {
    const start = formatDate(job.deadline);
    const end = nextDay(job.deadline);

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `📋 Apply by: ${job.company} — ${job.title}`,
        dates: `${start}/${end}`,
        details: `Last date to apply for ${job.title} at ${job.company} via PlacementHub.\n\nLocation: ${job.location}`,
        location: job.location,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
