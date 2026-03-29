import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };

const ProgressChart = ({ solved = [] }) => {
  const counts = solved.reduce((acc, p) => {
    acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  if (!data.length) return (
    <div className="card flex-center" style={{ height: '200px', color: 'var(--text-muted)' }}>
      No problems solved yet
    </div>
  );

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Problems by Difficulty</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label>
            {data.map(entry => (
              <Cell key={entry.name} fill={COLORS[entry.name] || '#6366f1'} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
