'use client';

import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProductivityAnalysis() {
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({ totalTime: 0, completedSessions: 0, avgSession: 0 });

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, 'studySessions'));
            const sessions = [];
            let totalMinutes = 0, sessionCount = 0, completedCount = 0;

            querySnapshot.forEach((doc) => {
                const session = doc.data();
                sessions.push({ day: session.day, minutes: session.minutes });
                totalMinutes += session.minutes;
                sessionCount++;
                if (session.completed) completedCount++;
            });

            setData(sessions);
            setStats({
                totalTime: totalMinutes,
                completedSessions: completedCount,
                avgSession: sessionCount ? (totalMinutes / sessionCount).toFixed(1) : 0
            });
        };
        fetchData();
    }, []);

    return (
        <div className='min-h-screen bg-black text-white p-6'>
            <h1 className='text-3xl font-bold flex items-center gap-2'>
                📊 Productivity Analysis
            </h1>
            <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
                <StatCard icon='⏳' title='Total Study Time' value={`${stats.totalTime} mins`} />
                <StatCard icon='🎯' title='Goals Completed' value={stats.completedSessions} />
                <StatCard icon='🗓️' title='Avg Study Session' value={`${stats.avgSession} mins`} />
            </div>
            <h2 className='text-2xl font-bold mt-8 flex items-center gap-2'>
                📈 Weekly Study Trends
            </h2>
            <div className='mt-4 bg-gray-900 p-4 rounded-lg'>
                {data.length > 0 ? (
                    <ResponsiveContainer width='100%' height={300}>
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey='day' stroke='white' />
                            <YAxis stroke='white' />
                            <Tooltip wrapperStyle={{ backgroundColor: '#333', color: '#fff' }} />
                            <Bar dataKey='minutes' fill='#4CAF50' radius={[5, 5, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className='text-gray-400 text-center'>No study data available yet.</p>
                )}
            </div>
        </div>
    );
}

const StatCard = ({ icon, title, value }) => (
    <div className='flex items-center bg-gray-800 p-4 rounded-lg shadow-md'>
        <span className='text-2xl mr-4'>{icon}</span>
        <div>
            <h3 className='text-lg font-semibold'>{title}</h3>
            <p className='text-gray-300'>{value}</p>
        </div>
    </div>
);
