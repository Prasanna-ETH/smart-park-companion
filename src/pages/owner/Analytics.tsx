import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import StatCard from '@/components/StatCard';
import { TrendingUp, Users, Clock, Car, Loader2 } from 'lucide-react';
import api from '@/lib/api';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--neon-cyan))', 'hsl(var(--muted-foreground))'];

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [parkId, setParkId] = useState<number | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: parks } = await api.get('/owner/parks');
      if (parks && parks.length > 0) {
        const id = parks[0].id;
        setParkId(id);

        const [analyticsRes, dashboardRes] = await Promise.all([
          api.get(`/owner/analytics/${id}`),
          api.get(`/owner/dashboard/${id}`)
        ]);

        setAnalyticsData(analyticsRes.data);
        setDashboardData(dashboardRes.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const vehicleTypes = [
    { name: 'Cars', value: 65 },
    { name: 'Bikes', value: 25 },
    { name: 'Others', value: 10 },
  ];

  const occupancyRate = dashboardData ? Math.round((dashboardData.occupied_slots / dashboardData.total_slots) * 100) : 0;
  const revenue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(dashboardData?.total_revenue || 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Insights and trends for your parking facility: {dashboardData?.park_name}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={revenue}
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Current Occupancy"
          value={`${occupancyRate}%`}
          icon={Car}
          variant="default"
        />
        <StatCard
          title="Total Slots"
          value={dashboardData?.total_slots || 0}
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Available"
          value={dashboardData?.available_slots || 0}
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue/Occupancy Trend Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Revenue Trend (₹)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData?.trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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

        {/* Occupancy Trend */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Occupancy Rate (%)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analyticsData?.trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="occupancy"
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

        {/* Top Busy Slots */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Most Used Slots</h3>
          <div className="space-y-4">
            {analyticsData?.top_slots.map((s: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-xs">{s.slot}</span>
                  <span className="text-sm font-medium">Popular Spot</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold">{s.count} times</span>
                  <p className="text-xs text-muted-foreground">last 30 days</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
