import { writeFile } from 'node:fs/promises';

const url = process.env.MONITOR_DATA_URL;
if (!url) throw new Error('MONITOR_DATA_URL non configurato');
const headers = process.env.MONITOR_DATA_TOKEN ? { Authorization: `Bearer ${process.env.MONITOR_DATA_TOKEN}` } : {};
const response = await fetch(url, { headers });
if (!response.ok) throw new Error(`Endpoint monitor: HTTP ${response.status}`);
const data = await response.json();
if (!data || typeof data !== 'object' || !data.summary) throw new Error('Formato JSON monitor non valido');
data.updatedAt ||= new Date().toISOString();
await writeFile('data.json', `${JSON.stringify(data, null, 2)}\n`);
