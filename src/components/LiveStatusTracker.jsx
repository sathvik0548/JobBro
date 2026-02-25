import { STATUS_TIMELINE } from '../data/mockData';

/**
 * LiveStatusTracker - A horizontal progress bar for tracking application status.
 * Shows stages: Applied → Shortlisted → HR Round → Selected
 */
export default function LiveStatusTracker({ status }) {
    const isRejected = status === 'Rejected';
    const currentIdx = STATUS_TIMELINE.indexOf(status);

    return (
        <div className="status-tracker-container">
            <div className="status-tracker-line-bg"></div>
            {!isRejected && (
                <div
                    className="status-tracker-line-progress"
                    style={{ width: `${(Math.max(0, currentIdx) / (STATUS_TIMELINE.length - 1)) * 100}%` }}
                ></div>
            )}

            <div className="status-tracker-steps">
                {STATUS_TIMELINE.map((step, index) => {
                    const isCompleted = !isRejected && index < currentIdx;
                    const isCurrent = !isRejected && index === currentIdx;
                    const isUpcoming = !isRejected && index > currentIdx;

                    let stepClass = '';
                    if (isCompleted) stepClass = 'completed';
                    if (isCurrent) stepClass = 'current';
                    if (isUpcoming) stepClass = 'upcoming';
                    if (isRejected && index <= STATUS_TIMELINE.indexOf('Shortlisted')) {
                        // If rejected later, maybe show some history? 
                        // For simplicity, if rejected, we show a special state.
                    }

                    return (
                        <div key={step} className={`status-tracker-step ${stepClass}`}>
                            <div className="status-tracker-dot">
                                {isCompleted ? '✓' : index + 1}
                            </div>
                            <div className="status-tracker-label">{step}</div>
                        </div>
                    );
                })}

                {isRejected && (
                    <div className="status-tracker-step rejected">
                        <div className="status-tracker-dot">✕</div>
                        <div className="status-tracker-label">Rejected</div>
                    </div>
                )}
            </div>
        </div>
    );
}
