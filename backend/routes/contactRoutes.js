const express = require('express');
const router = express.Router();
const pool = require('../db');



//Create a new Contact
router.post('/',async (req,res)=>{
    const userId = req.userId;
    const{first_name,last_name,email,phone_number,address}=req.body;

    try{
        const sql=`
            INSERT INTO contacts (userid,first_name, last_name, email, phone_number,address)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *;`;
        
        const values =[userId,first_name,last_name,email,phone_number,address];

        const result = await pool.query(sql,values);

        res.status(201).json(result.rows[0]);
    }
    catch(err){
        console.error("Error creating contact:",err.message);
        res.status(500).json({error:'Server error while creating contact.'});
    }
});

// Read all contacts
router.get('/',async(req,res)=>{
    try{
        const sql=`SELECT * FROM contacts ORDER BY last_name ASC;`;
        const result = await pool.query(sql);
        res.status(200).json(result.rows);
    }catch(err){
        console.error("Error fetching contacts:",err.message);
        res.status(500).json({error:`Server error while fetching contacts.`});
    }
});

//Update contact
router.put('/:id',async(req,res)=>{
    const{id} = req.params;
    const{first_name,last_name,email,phone_number,address} = req.body;

    try{
        const sql=`
            UPDATE contacts 
            SET
                first_name = $1,
                last_name = $2,
                email = $3,
                phone_number = $4,
                address = $5
            WHERE id = $6
            RETURNING *;
            `;
            const values = [first_name,last_name,email,phone_number,address,id];

            const result = await pool.query(sql,values);

            if(result.rowCount === 0){
                return res.status(404).json({error: "Contact not found ."});
            }
            res.status(200).json(result.rows[0]);
    }catch(err){
        console.error("Error updating contact:", err.message);
        res.status(500).json({error:'Server error while updating contact.'});
    }
});

// Delete a specific contact

router.delete('/:id',async (req,res)=>{
    const {id}=req.params;
    try{
        const sql=`DELETE FROM contacts WHERE id=$1;`;
        const result = await pool.query(sql,[id]);

        if(result.rowCount === 0){
            return res.status(404).json({error:"Contact not found ."});
        }
        res.status(204).send();
    }catch(err){
        console.error("Erroe deleting contact :",err.message);
        res.status(500).json({error:'Server error while deleting contact.'});
    }

});

// READ ONE CONTACT: GET /api/contacts/:id

router.get('/:id', async (req, res) => {
    // 1. Get the ID of the contact from the URL parameter
    const { id } = req.params; 
    
    // 2. Get the ID of the logged-in user (from the middleware)
    const userId = req.userId;

    try {
        // CRITICAL: Select by ID AND ensure ownership (user_id = $2)
        const sql = `SELECT * FROM contacts WHERE id = $1 AND userid = $2;`;
        
        const result = await pool.query(sql, [id, userId]);
        
        if (result.rowCount === 0) {
            // Return 404 if contact not found OR if it belongs to another user
            return res.status(404).json({ error: "Contact not found or access denied." });
        }
        
        // Return the single contact object
        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error("Error fetching single contact:", err.message);
        res.status(500).json({ error: 'Server error while fetching contact.' });
    }
});
module.exports =router;