import './ScheduleGrid.css';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const TIME_SLOTS = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00',
  '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00',
];

const COLORS = [
  'var(--sched-blue)', 'var(--sched-green)', 'var(--sched-purple)',
  'var(--sched-orange)', 'var(--sched-red)', 'var(--sched-teal)',
  'var(--sched-pink)', 'var(--sched-indigo)',
];

function getColor(index) {
  return COLORS[index % COLORS.length];
}

export default function ScheduleGrid({ assignments = [], onCellClick }) {
  // Build a lookup: grid[dayIndex][timeIndex] = assignment
  const grid = {};
  const courseColorMap = {};
  let colorIndex = 0;

  assignments.forEach(a => {
    const dayKey = a.day;
    const timeKey = a.startTime;
    const key = `${dayKey}_${timeKey}`;
    
    const courseId = a.courseId?._id || a.courseId;
    if (!courseColorMap[courseId]) {
      courseColorMap[courseId] = getColor(colorIndex++);
    }
    
    grid[key] = {
      ...a,
      color: courseColorMap[courseId],
      courseName: a.courseId?.name || a.courseName || 'Curso',
      classroomName: a.classroomId?.name || a.classroomName || '',
      teacherName: a.teacherId?.name || a.teacherName || '',
    };
  });

  const dayKeys = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

  return (
    <div className="schedule-grid-wrapper">
      <div className="schedule-grid">
        <div className="schedule-header-row">
          <div className="schedule-time-header">Hora</div>
          {DAYS.map(day => (
            <div key={day} className="schedule-day-header">{day}</div>
          ))}
        </div>

        {TIME_SLOTS.map((slot, ti) => {
          const timeKey = slot.split(' - ')[0];
          return (
            <div key={slot} className="schedule-row">
              <div className="schedule-time-cell">{slot}</div>
              {dayKeys.map((dayKey, di) => {
                const key = `${dayKey}_${timeKey}`;
                const cell = grid[key];
                return (
                  <div
                    key={key}
                    className={`schedule-cell ${cell ? 'has-content' : ''}`}
                    onClick={() => cell && onCellClick && onCellClick(cell)}
                  >
                    {cell && (
                      <div className="cell-content" style={{ background: cell.color + '18', borderLeft: `3px solid ${cell.color}` }}>
                        <span className="cell-course" style={{ color: cell.color }}>{cell.courseName}</span>
                        <span className="cell-detail">{cell.classroomName}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
