const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        let whereClause = {};

        // Basic filtering logic
        if (user.dietaryPref) {
            // In a real app, this would be more complex tag filtering
            whereClause.tags = { contains: user.dietaryPref };
        }

        const meals = await prisma.meal.findMany({
            where: whereClause,
            take: 10
        });

        if (meals.length === 0) {
            // Return fallback if no specific matches
            const fallbackMeals = await prisma.meal.findMany({ take: 5 });
            return res.json(fallbackMeals);
        }

        res.json(meals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createMeal = async (req, res) => {
    // Internal use or admin
    try {
        const { name, calories, type, tags } = req.body;
        const meal = await prisma.meal.create({
            data: {
                name,
                calories,
                type,
                tags
            }
        });
        res.status(201).json(meal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
