const express = require('express');
const School = require('../models/School');
const router = express.Router();

// Add School API
router.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).send('All fields are required and must be of the correct type.');
    }

    const school = new School({ name, address, latitude, longitude });

    try {
        await school.save();
        res.status(201).send('School added successfully');
    } catch (err) {
        res.status(500).send('Error saving school');
    }
});

// List Schools API
router.get('/listSchools', async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).send('Latitude and longitude are required.');
    }

    try {
        const schools = await School.find();

        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);

        schools.forEach(school => {
            school.distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
        });

        schools.sort((a, b) => a.distance - b.distance);

        res.json(schools);
    } catch (err) {
        res.status(500).send('Error fetching schools');
    }
});

// Helper function to calculate the distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = x => x * Math.PI / 180;
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

module.exports = router;
