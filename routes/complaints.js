const express = require("express");
const multer = require("multer");

const router = express.Router();
const db = require("../config/database");

// Photo storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        const fileName = Date.now() + "-" + file.originalname;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });


// Submit Complaint
router.post("/", upload.single("photo"), (req, res) => {

    const {
        user_id,
        category,
        location,
        description
    } = req.body;

    if (!user_id || !category || !location || !description) {
        return res.status(400).json({
            message: "Please fill all required fields"
        });
    }

    const photo = req.file ? req.file.filename : null;

    const sql = `
        INSERT INTO complaints
        (user_id, category, location, description, photo)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [user_id, category, location, description, photo],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Complaint submission failed"
                });
            }

            res.status(201).json({
                message: "Complaint submitted successfully",
                complaintId: result.insertId
            });
        }
    );
});

// Get complaints of a citizen
router.get("/user/:userId", (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT
            id,
            category,
            location,
            description,
            photo,
            status,
            created_at
        FROM complaints
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Unable to fetch complaints"
            });

        }

        res.json(results);

    });

});
// Admin: Get all complaints
router.get("/all", (req, res) => {
    const sql = `
        SELECT id, category, location, description, photo, status, created_at
        FROM complaints
        ORDER BY created_at DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Unable to fetch complaints" });
        }
        res.json(results);
    });
});

// Admin: Update complaint status
router.put("/:id/status", (req, res) => {
    const complaintId = req.params.id;
    const { status } = req.body;

    const sql = `UPDATE complaints SET status = ? WHERE id = ?`;

    db.query(sql, [status, complaintId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Unable to update status" });
        }
        res.json({ message: "Status updated successfully" });
    });
});
module.exports = router;