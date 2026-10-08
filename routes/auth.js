const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();
const db = require("../config/database");

// Register Citizen
router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check existing email
        db.query(
            "SELECT id FROM users WHERE email = ?",
            [email],
            async (err, results) => {

                if (err) {
                    console.log("REGISTER SELECT ERROR:",err);
                    return res.status(500).json({
                        message: "Database error"
                    });
                }

                if (results.length > 0) {
                    return res.status(400).json({
                        message: "Email already registered"
                    });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const sql = `
                    INSERT INTO users
                    (name, email, phone, password, role)
                    VALUES (?, ?, ?, ?, 'citizen')
                `;

                db.query(
                    sql,
                    [name, email, phone, hashedPassword],
                    (err) => {

                        if (err) {
                            return res.status(500).json({
                                message: "Registration failed"
                            });
                        }

                        res.status(201).json({
                            message: "Registration successful"
                        });
                    }
                );
            }
        );

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

// Login Citizen
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    });

});

module.exports = router;