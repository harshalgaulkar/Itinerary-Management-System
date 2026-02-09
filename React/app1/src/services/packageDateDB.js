/**
 * Direct Database Query Service for Package Dates
 * This file provides a direct database query mechanism to bypass the API if needed
 * 
 * Usage: Only use if backend API endpoints are not returning dates
 */

import mysql from 'mysql2/promise';

class PackageDateDB {
  constructor() {
    this.pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'manager',
      database: 'Fin',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  /**
   * Get all dates for a specific package
   * @param {number} packageId - The package ID
   * @returns {Promise<Array>} Array of package date objects
   */
  async getDatesByPackageId(packageId) {
    try {
      const connection = await this.pool.getConnection();
      
      const query = `
        SELECT 
          package_date_id,
          package_id,
          start_date,
          end_date,
          seats_total,
          seats_booked,
          is_active
        FROM package_dates
        WHERE package_id = ? AND is_active = 1
        ORDER BY start_date ASC
      `;
      
      const [rows] = await connection.execute(query, [packageId]);
      connection.release();
      
      return rows;
    } catch (error) {
      console.error('Error querying package dates:', error);
      throw error;
    }
  }

  /**
   * Get all packages with their date counts
   * @returns {Promise<Array>} Array of packages with date counts
   */
  async getAllPackagesWithDateCounts() {
    try {
      const connection = await this.pool.getConnection();
      
      const query = `
        SELECT 
          p.package_id,
          p.title,
          COUNT(pd.package_date_id) as date_count,
          SUM(pd.seats_total) as total_seats
        FROM packages p
        LEFT JOIN package_dates pd ON p.package_id = pd.package_id
        GROUP BY p.package_id, p.title
        ORDER BY p.package_id
      `;
      
      const [rows] = await connection.execute(query);
      connection.release();
      
      return rows;
    } catch (error) {
      console.error('Error querying packages with dates:', error);
      throw error;
    }
  }

  /**
   * Get available dates (not fully booked) for a package
   * @param {number} packageId - The package ID
   * @returns {Promise<Array>} Array of available package dates
   */
  async getAvailableDatesByPackageId(packageId) {
    try {
      const connection = await this.pool.getConnection();
      
      const query = `
        SELECT 
          package_date_id,
          package_id,
          start_date,
          end_date,
          seats_total,
          seats_booked,
          (seats_total - seats_booked) as available_seats,
          is_active
        FROM package_dates
        WHERE package_id = ? 
          AND is_active = 1
          AND (seats_total - seats_booked) > 0
        ORDER BY start_date ASC
      `;
      
      const [rows] = await connection.execute(query, [packageId]);
      connection.release();
      
      return rows;
    } catch (error) {
      console.error('Error querying available dates:', error);
      throw error;
    }
  }

  /**
   * Close database connections
   */
  async close() {
    await this.pool.end();
  }
}

export default new PackageDateDB();
