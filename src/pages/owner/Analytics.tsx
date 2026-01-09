import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import StatCard from '@/components/StatCard';
import { TrendingUp, Users, Clock, Car } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', revenue: 4200, occupancy: 78 },
  { day: 'Tue', revenue: 3800, occupancy: 65 },
  { day: 'Wed', revenue: 5100, occupancy: 82 },
  { day: 'Thu', revenue: 4600, occupancy: 75 },
  { day: 'Fri', revenue: 6200, occupancy: 92 },
  { day: 'Sat', revenue: 7100, occupancy: 95 },
  { day: 'Sun', revenue: 5400, occupancy: 88 },
];

const hourlyData = [
  { hour: '6AM', vehicles: 12 },
  { hour: '9AM', vehicles: 45 },
  { hour: '12PM', vehicles: 38 },
  { hour: '3PM', vehicles: 42 },
  { hour: '6PM', vehicles: 55 },
  { hour: '9PM', vehicles: 28 },
];

const vehicleTypes = [
  { name: 'Cars', value: 65 },
  { name: 'Bikes', value: 25 },
  { name: 'Others', value: 10 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--neon-cyan))', 'hsl(var(--muted-foreground))'];

const Analytics = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Insights and trends for your parking facility</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Weekly Revenue"
          value="₹36,400"
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Avg. Occupancy"
          value="82%"
          icon={Car}
          variant="default"
        />
        <StatCard
          title="Unique Visitors"
          value="847"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
          variant="default"
        />
        <StatCard
          title="Avg. Duration"
          value="2.4 hrs"
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Weekly Revenue (₹)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Traffic */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Hourly Traffic</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="vehicles"
                stroke="hsl(var(--neon-cyan))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--neon-cyan))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Types */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Vehicle Types</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={vehicleTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {vehicleTypes.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {vehicleTypes.map((type, index) => (
              <div key={type.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-sm text-muted-foreground">
                  {type.name} ({type.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Occupancy Trend */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Occupancy Rate (%)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="occupancy" fill="hsl(var(--slot-available))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
