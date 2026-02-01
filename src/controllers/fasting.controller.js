const { PrismaClient } = require('@prisma/client');
const fastingService = require('../services/fasting.service');

const prisma = new PrismaClient();

exports.startFast = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { startTime } = req.body; // Optional, default now

        // Check if active session exists
        const activeSession = await prisma.fastSession.findFirst({
            where: { userId, status: 'active' }
        });

        if (activeSession) {
            return res.status(400).json({ error: 'You already have an active fast.' });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const start = startTime ? new Date(startTime) : new Date();
        const plannedEnd = fastingService.calculateEndTime(start, user.currentProtocol);

        const session = await prisma.fastSession.create({
            data: {
                userId,
                startTime: start,
                plannedEndTime: plannedEnd,
                status: 'active'
            }
        });

        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.endFast = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { mood, notes } = req.body;

        const activeSession = await prisma.fastSession.findFirst({
            where: { userId, status: 'active' }
        });

        if (!activeSession) {
            return res.status(400).json({ error: 'No active fast to end.' });
        }

        const updatedSession = await prisma.fastSession.update({
            where: { id: activeSession.id },
            data: {
                endTime: new Date(),
                status: 'completed',
                mood,
                notes
            }
        });

        res.json(updatedSession);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const activeSession = await prisma.fastSession.findFirst({
            where: { userId, status: 'active' }
        });

        if (!activeSession) {
            return res.json({ status: 'inactive', message: 'No active fast.' });
        }

        const progress = fastingService.getProgress(activeSession);

        res.json({
            ...activeSession,
            progress
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const sessions = await prisma.fastSession.findMany({
            where: { userId, status: 'completed' },
            orderBy: { startTime: 'desc' },
            take: 20
        });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
