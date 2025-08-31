import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import pg from 'pg';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database setup - PostgreSQL for production, SQLite for development
const isProduction = process.env.NODE_ENV === 'production';
let db;

if (isProduction && process.env.DATABASE_URL) {
  // PostgreSQL for production
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  console.log('Using PostgreSQL database');
} else {
  // SQLite for development
  const dbPath = process.env.DATABASE_PATH || join(__dirname, 'rma_system.db');
  db = new sqlite3.Database(dbPath);
  console.log('Using SQLite database');
}

// Initialize database tables
const initializeTables = async () => {
  const rmaTableSQL = isProduction ? `
    CREATE TABLE IF NOT EXISTS rma_records (
      id SERIAL PRIMARY KEY,
      rma_number TEXT UNIQUE,
      customer_name TEXT,
      customer_phone TEXT,
      product_name TEXT,
      issue_description TEXT,
      date_received TEXT,
      status TEXT,
      ordered_from TEXT,
      date_ordered TEXT,
      order_number TEXT,
      invoice TEXT,
      invoice_link TEXT,
      replacement_address TEXT,
      original_status TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  ` : `
    CREATE TABLE IF NOT EXISTS rma_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rma_number TEXT UNIQUE,
      customer_name TEXT,
      customer_phone TEXT,
      product_name TEXT,
      issue_description TEXT,
      date_received TEXT,
      status TEXT,
      ordered_from TEXT,
      date_ordered TEXT,
      order_number TEXT,
      invoice TEXT,
      invoice_link TEXT,
      replacement_address TEXT,
      original_status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const testResultsSQL = isProduction ? `
    CREATE TABLE IF NOT EXISTS test_results (
      id TEXT PRIMARY KEY,
      rma_number TEXT,
      customer_name TEXT,
      order_number TEXT,
      invoice TEXT,
      customer_phone TEXT,
      product_sku_id TEXT,
      testing_status TEXT,
      date_tested TEXT,
      issue_description TEXT,
      date_ordered TEXT,
      additional_comments TEXT,
      invoice_link TEXT,
      replacement_address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  ` : `
    CREATE TABLE IF NOT EXISTS test_results (
      id TEXT PRIMARY KEY,
      rma_number TEXT,
      customer_name TEXT,
      order_number TEXT,
      invoice TEXT,
      customer_phone TEXT,
      product_sku_id TEXT,
      testing_status TEXT,
      date_tested TEXT,
      issue_description TEXT,
      date_ordered TEXT,
      additional_comments TEXT,
      invoice_link TEXT,
      replacement_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const csvUploadsSQL = isProduction ? `
    CREATE TABLE IF NOT EXISTS csv_uploads (
      id SERIAL PRIMARY KEY,
      filename TEXT,
      total_rows INTEGER,
      valid_rmas INTEGER,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  ` : `
    CREATE TABLE IF NOT EXISTS csv_uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT,
      total_rows INTEGER,
      valid_rmas INTEGER,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  if (isProduction) {
    await db.query(rmaTableSQL);
    await db.query(testResultsSQL);
    await db.query(csvUploadsSQL);
  } else {
    db.serialize(() => {
      db.run(rmaTableSQL);
      db.run(testResultsSQL);
      db.run(csvUploadsSQL);
    });
  }
};

initializeTables().catch(console.error);

// API Routes

// Get all RMA records
app.get('/api/rma-records', async (req, res) => {
  try {
    if (isProduction) {
      const result = await db.query('SELECT * FROM rma_records ORDER BY created_at DESC');
      res.json(result.rows);
    } else {
      db.all('SELECT * FROM rma_records ORDER BY created_at DESC', (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload CSV data
app.post('/api/upload-csv', async (req, res) => {
  const { data, filename, stats } = req.body;
  
  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  try {
    if (isProduction) {
      // PostgreSQL version
      await db.query('DELETE FROM rma_records');
      
      for (const record of data) {
        await db.query(`
          INSERT INTO rma_records 
          (rma_number, customer_name, customer_phone, product_name, issue_description, 
           date_received, status, ordered_from, date_ordered, order_number, invoice, 
           invoice_link, replacement_address, original_status) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (rma_number) DO UPDATE SET
          customer_name = EXCLUDED.customer_name,
          customer_phone = EXCLUDED.customer_phone,
          product_name = EXCLUDED.product_name,
          issue_description = EXCLUDED.issue_description,
          updated_at = CURRENT_TIMESTAMP
        `, [
          record.rmaNumber, record.customerName, record.customerPhone,
          record.productName, record.issueDescription, record.dateReceived,
          record.status, record.orderedFrom, record.dateOrdered,
          record.orderNumber, record.invoice, record.invoiceLink,
          record.replacementAddress, record.originalStatus
        ]);
      }
      
      await db.query('INSERT INTO csv_uploads (filename, total_rows, valid_rmas) VALUES ($1, $2, $3)',
        [filename, stats.totalRows, stats.validRMAs]);
      
      res.json({ 
        success: true, 
        message: `Successfully uploaded ${data.length} RMA records`,
        stats: stats
      });
    } else {
      // SQLite version (existing code)
      db.run('DELETE FROM rma_records', (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        const stmt = db.prepare(`INSERT OR REPLACE INTO rma_records 
          (rma_number, customer_name, customer_phone, product_name, issue_description, 
           date_received, status, ordered_from, date_ordered, order_number, invoice, 
           invoice_link, replacement_address, original_status) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        let insertCount = 0;
        data.forEach(record => {
          stmt.run([
            record.rmaNumber, record.customerName, record.customerPhone,
            record.productName, record.issueDescription, record.dateReceived,
            record.status, record.orderedFrom, record.dateOrdered,
            record.orderNumber, record.invoice, record.invoiceLink,
            record.replacementAddress, record.originalStatus
          ], (err) => {
            if (!err) insertCount++;
          });
        });

        stmt.finalize((err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          db.run('INSERT INTO csv_uploads (filename, total_rows, valid_rmas) VALUES (?, ?, ?)',
            [filename, stats.totalRows, stats.validRMAs], (err) => {
              if (err) console.error('Failed to record upload metadata:', err);
            });

          res.json({ 
            success: true, 
            message: `Successfully uploaded ${insertCount} RMA records`,
            stats: stats
          });
        });
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all test results
app.get('/api/test-results', async (req, res) => {
  try {
    if (isProduction) {
      const result = await db.query('SELECT * FROM test_results ORDER BY created_at DESC');
      res.json(result.rows);
    } else {
      db.all('SELECT * FROM test_results ORDER BY created_at DESC', (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit test result
app.post('/api/test-results', async (req, res) => {
  const result = req.body;
  
  try {
    if (isProduction) {
      await db.query(`
        INSERT INTO test_results 
        (id, rma_number, customer_name, order_number, invoice, customer_phone, 
         product_sku_id, testing_status, date_tested, issue_description, 
         date_ordered, additional_comments, invoice_link, replacement_address) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO UPDATE SET
        testing_status = EXCLUDED.testing_status,
        additional_comments = EXCLUDED.additional_comments
      `, [
        result.id, result.rmaNumber, result.customerName, result.orderNumber,
        result.invoice, result.customerPhone, result.productSkuId, result.testingStatus,
        result.dateTested, result.issueDescription, result.dateOrdered,
        result.additionalComments, result.invoiceLink, result.replacementAddress
      ]);
      res.json({ success: true, id: result.id });
    } else {
      const stmt = db.prepare(`INSERT OR REPLACE INTO test_results 
        (id, rma_number, customer_name, order_number, invoice, customer_phone, 
         product_sku_id, testing_status, date_tested, issue_description, 
         date_ordered, additional_comments, invoice_link, replacement_address) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

      stmt.run([
        result.id, result.rmaNumber, result.customerName, result.orderNumber,
        result.invoice, result.customerPhone, result.productSkuId, result.testingStatus,
        result.dateTested, result.issueDescription, result.dateOrdered,
        result.additionalComments, result.invoiceLink, result.replacementAddress
      ], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ success: true, id: result.id });
      });

      stmt.finalize();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system status
app.get('/api/status', async (req, res) => {
  try {
    if (isProduction) {
      const [rmaResult, testResult, uploadResult] = await Promise.all([
        db.query('SELECT COUNT(*) as rma_count FROM rma_records'),
        db.query('SELECT COUNT(*) as test_count FROM test_results'),
        db.query('SELECT * FROM csv_uploads ORDER BY uploaded_at DESC LIMIT 1')
      ]);
      
      res.json({
        rmaRecords: parseInt(rmaResult.rows[0].rma_count),
        testResults: parseInt(testResult.rows[0].test_count),
        lastUpload: uploadResult.rows[0] || null
      });
    } else {
      db.get('SELECT COUNT(*) as rma_count FROM rma_records', (err, rmaResult) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        db.get('SELECT COUNT(*) as test_count FROM test_results', (err, testResult) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          db.get('SELECT * FROM csv_uploads ORDER BY uploaded_at DESC LIMIT 1', (err, uploadResult) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            res.json({
              rmaRecords: rmaResult.rma_count,
              testResults: testResult.test_count,
              lastUpload: uploadResult || null
            });
          });
        });
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`RMA Backend server running on port ${PORT}`);
});