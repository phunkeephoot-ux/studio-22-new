const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                weight: true,
                goalWeight: true,
                currentProtocol: true,
                dietaryPref: true
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { weight, goalWeight, currentProtocol, dietaryPref } = req.body;

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                weight,
                goalWeight,
                currentProtocol,
                dietaryPref
            },
            select: {
                id: true,
                email: true,
                name: true,
                weight: true,
                goalWeight: true,
                currentProtocol: true,
                dietaryPref: true
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
