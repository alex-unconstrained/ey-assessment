// pages/api/students.js

import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'redis://enough-stud-50977.upstash.io:6379',
  token: 'AcchAAIjcDEyNTg5ZjEyNmZjMmY0ZjBmYjk0ZDczYWZiYzBkNzJhMXAxMA',
})

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const students = await redis.get('students') || [];
      res.status(200).json({ students });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching students' });
    }
  } else if (req.method === 'POST') {
    try {
      const { students } = req.body;
      await redis.set('students', JSON.stringify(students));
      res.status(200).json({ message: 'Students saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error saving students' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}