// =============================================
// HELPERS & CONSTANTS — JobBro
// =============================================

export const DEPARTMENTS = ['CSE', 'ECE', 'ME', 'Civil', 'MBA', 'CSM', 'CST', 'CAI', 'CSD'];
export const YEARS = ['1st', '2nd', '3rd', '4th'];

export const COMPANY_EMOJIS = {
    Google: '🔵',
    Microsoft: '🟦',
    Amazon: '🟠',
    Infosys: '🟢',
    TCS: '🔴',
    Wipro: '⚫',
    Accenture: '🟣',
    Deloitte: '🟡',
};

export const APPLICATION_STATUSES = ['Applied', 'Shortlisted', 'HR Round', 'Selected', 'Rejected'];

export const STATUS_TIMELINE = ['Applied', 'Shortlisted', 'HR Round', 'Selected'];

export function daysUntilDeadline(dateStr) {
    const diff = new Date(dateStr) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isDeadlineSoon(dateStr) {
    return daysUntilDeadline(dateStr) <= 7;
}
