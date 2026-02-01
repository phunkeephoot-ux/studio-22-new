// Native fetch used

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

async function runTests() {
    console.log('Starting API Tests...');

    // 1. Register
    try {
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: `test_${Date.now()}@example.com`,
                password: 'password123',
                name: 'Test User'
            })
        });
        const regData = await regRes.json();
        console.log('Register:', regRes.status === 201 ? 'PASS' : 'FAIL', regData);
        authToken = regData.token;
    } catch (e) {
        console.error('Register Error:', e);
    }

    if (!authToken) return;

    // 2. Login
    try {
        // Skipped reusing token from register
    } catch (e) { }

    // 3. User Profile
    try {
        const profRes = await fetch(`${BASE_URL}/user/profile`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const profData = await profRes.json();
        console.log('Get Profile:', profRes.status === 200 ? 'PASS' : 'FAIL', profData.email ? 'OK' : 'No Email');
    } catch (e) { console.error('Profile Error:', e); }

    // 4. Start Fast
    try {
        const startRes = await fetch(`${BASE_URL}/fasting/start`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        const startData = await startRes.json();
        console.log('Start Fast:', startRes.status === 200 ? 'PASS' : 'FAIL', startData.status);
    } catch (e) { console.error('Start Fast Error:', e); }

    // 5. Get Status
    try {
        const statusRes = await fetch(`${BASE_URL}/fasting/status`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const statusData = await statusRes.json();
        console.log('Get Status:', statusRes.status === 200 ? 'PASS' : 'FAIL', statusData.progress ? 'Has Progress' : 'No Progress');
    } catch (e) { console.error('Status Error:', e); }

    // 6. End Fast
    try {
        const endRes = await fetch(`${BASE_URL}/fasting/end`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mood: 'Great', notes: 'First fast done' })
        });
        const endData = await endRes.json();
        console.log('End Fast:', endRes.status === 200 ? 'PASS' : 'FAIL', endData.status === 'completed' ? 'Completed' : 'Error');
    } catch (e) { console.error('End Fast Error:', e); }

    // 7. Get Recommendations
    try {
        const mealRes = await fetch(`${BASE_URL}/meals/recommendations`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const mealData = await mealRes.json();
        console.log('Meal Recs:', mealRes.status === 200 ? 'PASS' : 'FAIL', Array.isArray(mealData) ? 'Is Array' : 'Not Array');
    } catch (e) { console.error('Meals Error:', e); }

    console.log('Tests Completed.');
}

// Simple poller to wait for server
setTimeout(runTests, 2000);
