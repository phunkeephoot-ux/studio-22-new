const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getBookings = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        const targetDate = new Date(date);
        // Set range for the whole day
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const bookings = await prisma.booking.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            select: {
                startTime: true,
                service: true,
                status: true
            }
        });

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { clientName, clientEmail, clientPhone, service, date, startTime } = req.body;

        // Basic validation
        if (!clientName || !clientEmail || !service || !date || !startTime) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if slot is taken (simple check, assuming startTime match)
        // Ideally we should check for overlaps based on service duration (1hr vs 2hr)
        // But for MVP, exact start time matches + simple logic on frontend

        const bookingDate = new Date(date);

        const existing = await prisma.booking.findFirst({
            where: {
                date: bookingDate,
                startTime: startTime,
                status: {
                    not: 'cancelled'
                }
            }
        });

        if (existing) {
            return res.status(409).json({ error: 'Slot already booked' });
        }

        const newBooking = await prisma.booking.create({
            data: {
                clientName,
                clientEmail,
                clientPhone,
                service,
                date: bookingDate,
                startTime,
                status: 'confirmed' // Auto confirm for now
            }
        });

        res.status(201).json({ message: 'Booking confirmed', booking: newBooking });

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
