import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Sidebar';
import { COMPANY_EMOJIS } from '../../data/mockData';

export default function Analytics() {
    const { jobs, applications, students, user } = useApp();

    // 1. Placement Rate Calculations
    const totalStudents = students.length;
    const placedStudents = new Set(applications.filter(a => a.status === 'Selected').map(a => a.studentId)).size;
    const placementRate = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;

    // 2. Department-wise Placement
    const depts = [...new Set(students.map(s => s.dept))];
    const deptStats = depts.map(dept => {
        const deptStudents = students.filter(s => s.dept === dept);
        const deptPlaced = new Set(applications.filter(a => {
            const student = students.find(s => s.id === a.studentId);
            return student && student.dept === dept && a.status === 'Selected';
        }).map(a => a.studentId)).size;
        return {
            name: dept,
            rate: deptStudents.length > 0 ? Math.round((deptPlaced / deptStudents.length) * 100) : 0,
            placed: deptPlaced,
            total: deptStudents.length,
            apps: applications.filter(a => {
                const student = students.find(s => s.id === a.studentId);
                return student && student.dept === dept;
            }).length
        };
    });

    // 3. Top Recruiting Companies (Based on Selected)
    const companySuccess = {};
    applications.forEach(a => {
        const job = jobs.find(j => j.id === a.jobId);
        if (job && a.status === 'Selected') {
            companySuccess[job.company] = (companySuccess[job.company] || 0) + 1;
        }
    });
    const topRecruiters = Object.entries(companySuccess)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    const maxRecruitCount = Math.max(...Object.values(companySuccess), 1);

    // 4. Salary Metrics (Parsing "...-22 LPA" or "20 LPA")
    const packages = jobs.map(j => {
        const match = j.ctc.match(/(\d+(\.\d+)?)/g);
        return match ? parseFloat(match[match.length - 1]) : 0;
    }).filter(p => p > 0);
    const highestPackage = packages.length > 0 ? Math.max(...packages).toFixed(1) : '0.0';
    const avgPackage = packages.length > 0 ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1) : '0.0';

    // 5. Application Status Breakdown
    const statusCounts = {
        'Applied': 0,
        'Shortlisted': 0,
        'HR Round': 0,
        'Rejected': 0,
        'Selected': 0
    };
    applications.forEach(a => {
        if (statusCounts[a.status] !== undefined) statusCounts[a.status]++;
    });
    const totalApps = applications.length;

    return (
        <div className="page-layout analytics-page-light">
            <Sidebar />
            <div className="main-content">
                <header className="analytics-header">
                    <div className="analytics-title-main">Analytics</div>
                </header>

                <div className="analytics-body">
                    <div className="analytics-top-row">
                        {/* Placement Rate by Department */}
                        <div className="analytics-card-light">
                            <h3 className="card-title-light">Placement Rate by Department</h3>
                            <div className="dept-list-light">
                                {deptStats.map(dept => (
                                    <div key={dept.name} className="dept-item-light">
                                        <div className="dept-info-light">
                                            <span className="dept-name-light">{dept.name === 'CSE' ? 'Computer Science' : dept.name}</span>
                                            <span className="dept-rate-light">{dept.rate}%</span>
                                        </div>
                                        <div className="dept-progress-bg-light">
                                            <div className="dept-progress-bar-light" style={{ width: `${dept.rate}%` }}></div>
                                        </div>
                                        <div className="dept-subtext-light">
                                            {dept.placed} placed · {dept.total} students · {dept.apps} applications
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Recruiting Companies */}
                        <div className="analytics-card-light">
                            <h3 className="card-title-light">Top Recruiting Companies</h3>
                            <div className="recruiter-list-light">
                                {['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Wipro', 'Accenture'].map(company => {
                                    const count = companySuccess[company] || 0;
                                    const percentage = (count / maxRecruitCount) * 100;
                                    return (
                                        <div key={company} className="recruiter-item-light">
                                            <div className="recruiter-info-light">
                                                <span className="recruiter-name-light">{company}</span>
                                                <span className="recruiter-count-light">{count}</span>
                                            </div>
                                            <div className="recruiter-progress-bg-light">
                                                <div
                                                    className="recruiter-progress-bar-light"
                                                    style={{
                                                        width: `${count > 0 ? percentage : 0}%`,
                                                        background: company === 'Google' ? 'linear-gradient(90deg, #f59e0b, #10b981)' : 'var(--dark-progress-empty)'
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="recruiter-status-light">{count} selected</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics Row */}
                    <div className="analytics-metrics-section">
                        <h3 className="section-title-light">Key Metrics — Current Year</h3>
                        <div className="metrics-grid-light">
                            <div className="metric-card-light">
                                <div className="metric-icon-light">🏆</div>
                                <div className="metric-value-light color-green">{placementRate}%</div>
                                <div className="metric-label-light">Placement Rate</div>
                                <div className="metric-sub-light">{placedStudents} of {totalStudents} students</div>
                            </div>
                            <div className="metric-card-light">
                                <div className="metric-icon-light">💰</div>
                                <div className="metric-value-light color-blue">₹{avgPackage}L</div>
                                <div className="metric-label-light">Avg Package</div>
                                <div className="metric-sub-light">Across {new Set(jobs.map(j => j.company)).size} companies</div>
                            </div>
                            <div className="metric-card-light">
                                <div className="metric-icon-light">🚀</div>
                                <div className="metric-value-light color-orange">₹{highestPackage}L</div>
                                <div className="metric-label-light">Highest Package</div>
                                <div className="metric-sub-light">{jobs.filter(j => j.status === 'Open').length} drives still open</div>
                            </div>
                            <div className="metric-card-light">
                                <div className="metric-icon-light">📋</div>
                                <div className="metric-value-light color-cyan">{totalApps}</div>
                                <div className="metric-label-light">Total Applications</div>
                                <div className="metric-sub-light">{new Set(jobs.map(j => j.company)).size} recruiting companies</div>
                            </div>
                        </div>
                    </div>

                    {/* Application Status Breakdown */}
                    <div className="analytics-breakdown-section">
                        <h3 className="section-title-light">Application Status Breakdown</h3>
                        <div className="breakdown-grid-light">
                            {Object.entries(statusCounts).map(([status, count]) => {
                                const percentage = totalApps > 0 ? Math.round((count / totalApps) * 100) : 0;
                                let colorClass = '';
                                if (status === 'Applied') colorClass = 'blue';
                                if (status === 'Shortlisted') colorClass = 'orange';
                                if (status === 'HR Round') colorClass = 'cyan';
                                if (status === 'Rejected') colorClass = 'red';
                                if (status === 'Selected') colorClass = 'green';

                                return (
                                    <div key={status} className="breakdown-item-light">
                                        <div className={`breakdown-value-light color-${colorClass}`}>{count}</div>
                                        <div className="breakdown-label-light">{status}</div>
                                        <div className="breakdown-progress-bg-light">
                                            <div className={`breakdown-progress-bar-light bg-${colorClass}`} style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <div className="breakdown-percent-light">{percentage}%</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
