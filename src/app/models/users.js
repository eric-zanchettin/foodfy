const db = require('../../../config/db');
const { hash } = require('bcryptjs');

module.exports = {
    async all() {
        const results = await db.query(`
            SELECT
            id,
            name,
            email
            FROM users
            ORDER BY created_at ASC
        `, null);

        return results.rows;
    },

    async find(email) {
        const query = `
            SELECT * FROM users
            WHERE email LIKE '${email}'
        `

        const results = await db.query(query, null);
        return results.rows[0];
    },

    async findById(id) {
        const query = `
            SELECT * FROM users
            WHERE id = $1
        `

        const values = [id];

        const results = await db.query(query, values);
        return results.rows[0];
    },

    async create(data) {
        const query = `
            INSERT INTO users (
                name,
                email,
                password,
                is_admin,
                access_token,
                access_token_expires
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
            )
            RETURNING ID
        `;

        const password = await hash(data.password, 8);

        const values = [data.name, data.email, password, data.isAdmin, data.reset_token, data.reset_token_expires];

        const results = await db.query(query, values);
        return results.rows[0]
    },

    async updateToken(token, expiration, id) {
        await db.query(`
            UPDATE users
            SET access_token = $1,
            access_token_expires = $2
            WHERE id = $3
        `, [token, expiration, id]);

        return;
    },

    async updateFailToken(data, token, expiration, password, id) {
        password = await hash(password, 8);

        await db.query(`
            UPDATE users
            SET name = $1,
            access_token = $2,
            access_token_expires = $3,
            password = $4,
            is_admin = $5,
            WHERE id = $6
        `, [data.name, token, expiration, data.password, data.isAdmin, id]);

        return;
    },

    async updateUser(data) {
        const password = await hash(data.password, 8);
        const isAdmin = data.isAdmin == 'on' ? true : false;

        await db.query(`
            UPDATE users
            SET name = $1,
            email = $2,
            password = $3,
            is_admin = $4
            WHERE id = $5
        `, [data.name, data.email, password, isAdmin, data.id])

        return;
    },

    async updateRecoveryToken(token, expiration, id) {
        await db.query(`
            UPDATE users
            SET recovery_token = $1,
            recovery_token_expires = $2
            WHERE id = $3
        `, [token, expiration, id]);

        return;
    },

    async updateForgotPassword(newPassword, id) {
        newPassword = await hash(newPassword, 8);

        await db.query(`
            UPDATE users
            SET password = $1,
            recovery_token = $2,
            recovery_token_expires = $3
            WHERE id = $4
        `, [newPassword, null, null, id]);

        return;
    },

    async delete(id) {
        await db.query(`
            DELETE FROM users
            WHERE id = $1
        `, [id]);

        return;
    },
};