const mongoose = require('mongoose');
require('dotenv').config();

class DatabaseConfig {
  constructor() {
    this.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management';
    this.options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };
  }

  async connect() {
    try {
      await mongoose.connect(this.connectionString, this.options);
      console.log('✅ MongoDB connected successfully');

      mongoose.connection.on('error', err => {
        console.error('❌ MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });

      process.on('SIGINT', this.gracefulShutdown.bind(this));
      process.on('SIGTERM', this.gracefulShutdown.bind(this));

      // Optional: ensure indexes without conflicts
      await this.ensureIndexes();

    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      process.exit(1);
    }
  }

  async gracefulShutdown() {
    try {
      await mongoose.connection.close();
      console.log('🔒 MongoDB connection closed through app termination');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during graceful shutdown:', error);
      process.exit(1);
    }
  }

  async healthCheck() {
    try {
      const state = mongoose.connection.readyState;
      const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      };
      return {
        status: states[state],
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port
      };
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }

  async ensureIndexes() {
    try {
      const Student = require('../models/Student');
      const Teacher = require('../models/Teacher');
      const Parent = require('../models/Parent');
      const { Admin, Timetable, Documentation, Circular, Curriculum } = require('../models/Admin');

      await Promise.all([
        Student.syncIndexes(),
        Teacher.syncIndexes(),
        Parent.syncIndexes(),
        Admin.syncIndexes(),
        Timetable.syncIndexes(),
        Documentation.syncIndexes(),
        Circular.syncIndexes(),
        Curriculum.syncIndexes()
      ]);

      console.log('✅ All indexes synced successfully');
    } catch (error) {
      console.error('❌ Error syncing indexes:', error.message);
    }
  }
}

module.exports = new DatabaseConfig();
