// Helper to calculate target end time based on protocol
exports.calculateEndTime = (startTime, protocol) => {
    const start = new Date(startTime);
    let hoursToAdd = 16; // Default 16:8

    if (protocol === '18:6') hoursToAdd = 18;
    if (protocol === '20:4') hoursToAdd = 20;
    // For circadian, we'd need more logic (e.g., sunset time), defaulting to 13h for now
    if (protocol === 'circadian') hoursToAdd = 13;

    const endTime = new Date(start.getTime() + hoursToAdd * 60 * 60 * 1000);
    return endTime;
};

exports.getProgress = (session) => {
    if (!session) return null;
    const now = new Date();
    const start = new Date(session.startTime);
    const plannedEnd = new Date(session.plannedEndTime);

    const totalDuration = plannedEnd - start;
    const elapsed = now - start;

    const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    const remainingMs = Math.max(0, plannedEnd - now);

    return {
        percentage,
        remainingHours: Math.floor(remainingMs / (1000 * 60 * 60)),
        remainingMinutes: Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60)),
        status: session.status
    };
};
