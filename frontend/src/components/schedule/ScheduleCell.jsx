import './ScheduleCell.css';

/**
 * ScheduleCell — Individual cell in the schedule grid.
 * Shows course name, classroom, and optional teacher info.
 * 
 * Props:
 * - assignment: { courseName, classroomName, teacherName, color }
 * - onClick: callback
 */
export default function ScheduleCell({ assignment, onClick }) {
  if (!assignment) {
    return <div className="schedule-cell empty-cell" />;
  }

  return (
    <div
      className="schedule-cell has-content"
      onClick={() => onClick && onClick(assignment)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick(assignment)}
    >
      <div
        className="cell-content"
        style={{
          background: (assignment.color || 'var(--sched-blue)') + '18',
          borderLeft: `3px solid ${assignment.color || 'var(--sched-blue)'}`,
        }}
      >
        <span className="cell-course" style={{ color: assignment.color || 'var(--sched-blue)' }}>
          {assignment.courseName || 'Curso'}
        </span>
        <span className="cell-detail">
          {assignment.classroomName || ''}
        </span>
      </div>
    </div>
  );
}
