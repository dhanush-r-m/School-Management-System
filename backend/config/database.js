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
      family: 4,
      retryWrites: true,
      retryReads: true,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
      maxIdleTimeMS: 30000,
      appName: 'SchoolManagementSystem'
    };
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  async connect() {
    if (this.isConnecting) {
      console.log('⏳ Connection already in progress...');
      return;
    }

    this.isConnecting = true;

    try {
      // Set mongoose options globally
      mongoose.set('strictQuery', false);
      
      await mongoose.connect(this.connectionString, this.options);
      console.log('✅ MongoDB connected successfully');
      console.log(`📍 Connected to: ${mongoose.connection.name} on ${mongoose.connection.host}:${mongoose.connection.port}`);
      
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      
      // Set up connection event listeners
      this.setupConnectionListeners();
      
      // Set up graceful shutdown handlers
      this.setupGracefulShutdown();
      
      // Ensure indexes with proper error handling
      await this.ensureIndexes();
      
    } catch (error) {
      this.isConnecting = false;
      console.error('❌ MongoDB connection failed:', error.message);
      
      // Retry connection logic
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`🔄 Retrying connection (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        setTimeout(() => this.connect(), 5000);
      } else {
        console.error('❌ Max reconnection attempts reached. Exiting...');
        process.exit(1);
      }
    }
  }

  setupConnectionListeners() {
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      if (!this.isConnecting && this.reconnectAttempts < this.maxReconnectAttempts) {
        console.log('🔄 Attempting to reconnect...');
        this.connect();
      }
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
      this.reconnectAttempts = 0;
    });

    mongoose.connection.on('connected', () => {
      console.log('🟢 MongoDB connection established');
    });
  }

  setupGracefulShutdown() {
    const gracefulShutdown = this.gracefulShutdown.bind(this);
    
    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGUSR2', gracefulShutdown); // For nodemon restarts
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err);
      gracefulShutdown();
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown();
    });
  }

  async gracefulShutdown(signal = 'SIGTERM') {
    console.log(`📡 Received ${signal}. Graceful shutdown initiated...`);
    
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('🔒 MongoDB connection closed gracefully');
      }
      
      console.log('✨ Graceful shutdown completed');
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

      const health = {
        status: states[state],
        database: mongoose.connection.name || 'unknown',
        host: mongoose.connection.host || 'unknown',
        port: mongoose.connection.port || 'unknown',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      };

      // Test database operation if connected
      if (state === 1) {
        try {
          await mongoose.connection.db.admin().ping();
          health.ping = 'success';
        } catch (pingError) {
          health.ping = 'failed';
          health.pingError = pingError.message;
        }
      }

      return health;
    } catch (error) {
      return { 
        status: 'error', 
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async ensureIndexes() {
    try {
      console.log('🔍 Starting index synchronization...');
      
      // Dynamic model loading with error handling
      const models = await this.loadModels();
      
      if (models.length === 0) {
        console.log('⚠️ No models found to sync indexes');
        return;
      }

      // Process models sequentially to avoid conflicts
      for (const model of models) {
        try {
          console.log(`🔄 Processing indexes for ${model.modelName}...`);
          
          // Check for existing index conflicts first
          const hasConflicts = await this.checkIndexConflicts(model);
          
          if (hasConflicts) {
            console.log(`🔧 Resolving conflicts for ${model.modelName}...`);
            await this.resolveIndexConflict(model);
          } else {
            // Try normal sync first
            try {
              await model.syncIndexes();
              console.log(`✅ Indexes synced for ${model.modelName}`);
            } catch (syncError) {
              if (syncError.message.includes('existing index')) {
                console.log(`🔧 Conflict detected during sync for ${model.modelName}, resolving...`);
                await this.resolveIndexConflict(model);
              } else {
                throw syncError;
              }
            }
          }
          
        } catch (error) {
          console.error(`❌ Failed to process indexes for ${model.modelName}:`, error.message);
        }
      }

      console.log('✅ Index synchronization completed');
      
    } catch (error) {
      console.error('❌ Error during index synchronization:', error.message);
    }
  }

  async checkIndexConflicts(model) {
    try {
      const collection = model.collection;
      const existingIndexes = await collection.listIndexes().toArray();
      
      // Get expected indexes from schema
      const expectedIndexes = new Set();
      
      model.schema.eachPath((path, schemaType) => {
        if (schemaType.options.unique || schemaType.options.index) {
          expectedIndexes.add(path);
        }
      });

      // Check for conflicts (same name, different properties)
      const conflicts = existingIndexes.filter(index => {
        if (index.name === '_id_') return false;
        
        const fieldName = Object.keys(index.key)[0];
        if (expectedIndexes.has(fieldName)) {
          // Check if unique status differs
          const isExistingUnique = !!index.unique;
          const shouldBeUnique = !!(model.schema.paths[fieldName] && model.schema.paths[fieldName].options.unique);
          
          return isExistingUnique !== shouldBeUnique;
        }
        
        return false;
      });

      if (conflicts.length > 0) {
        console.log(`🔧 Found ${conflicts.length} conflicting indexes in ${model.modelName}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn(`⚠️ Could not check index conflicts for ${model.modelName}:`, error.message);
      return false;
    }
  }

  async loadModels() {
    const models = [];
    const modelPaths = [
      '../models/Student',
      '../models/Teacher', 
      '../models/Parent',
      '../models/Admin'
    ];

    for (const modelPath of modelPaths) {
      try {
        const modelExport = require(modelPath);
        
        // Handle different export patterns
        if (modelExport.default) {
          models.push(modelExport.default);
        } else if (typeof modelExport === 'function' || modelExport.schema) {
          models.push(modelExport);
        } else if (typeof modelExport === 'object') {
          // Handle multiple exports from Admin models
          Object.values(modelExport).forEach(model => {
            if (model && model.schema) {
              models.push(model);
            }
          });
        }
      } catch (error) {
        console.warn(`⚠️ Could not load model from ${modelPath}:`, error.message);
      }
    }

    return models.filter(model => model && model.schema);
  }

  async resolveIndexConflict(model) {
    try {
      console.log(`🔧 Attempting to resolve index conflict for ${model.modelName}...`);
      
      const collection = model.collection;
      const indexes = await collection.listIndexes().toArray();
      
      // Drop all indexes except _id_
      for (const index of indexes) {
        if (index.name !== '_id_') {
          try {
            await collection.dropIndex(index.name);
            console.log(`🗑️ Dropped index: ${index.name}`);
          } catch (dropError) {
            // If we can't drop the index, try dropping the entire collection indexes
            if (dropError.code === 27 || dropError.message.includes('not found')) {
              console.log(`⚠️ Index ${index.name} already dropped or not found`);
            } else {
              console.warn(`⚠️ Could not drop index ${index.name}:`, dropError.message);
            }
          }
        }
      }
      
      // Wait a moment for the drops to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force recreate indexes with ensureIndexes instead of syncIndexes
      await this.createModelIndexes(model);
      console.log(`✅ Indexes recreated for ${model.modelName}`);
      
    } catch (error) {
      console.error(`❌ Failed to resolve index conflict for ${model.modelName}:`, error.message);
      
      // Last resort: try to drop the collection and let it recreate
      try {
        console.log(`🔄 Attempting collection reset for ${model.modelName}...`);
        await this.resetCollectionIndexes(model);
      } catch (resetError) {
        console.error(`❌ Collection reset failed for ${model.modelName}:`, resetError.message);
      }
    }
  }

  async createModelIndexes(model) {
    try {
      const schema = model.schema;
      const collection = model.collection;
      
      // Get index definitions from schema
      const indexSpecs = [];
      
      // Process schema indexes
      schema.eachPath((path, schemaType) => {
        if (schemaType.options.unique) {
          indexSpecs.push({
            key: { [path]: 1 },
            options: { 
              unique: true, 
              name: `${path}_unique_1`,
              background: true 
            }
          });
        } else if (schemaType.options.index) {
          indexSpecs.push({
            key: { [path]: 1 },
            options: { 
              name: `${path}_index_1`,
              background: true 
            }
          });
        }
      });

      // Add compound indexes from schema
      const schemaIndexes = schema.indexes();
      for (const [keys, options] of schemaIndexes) {
        const indexName = Object.keys(keys).join('_') + '_compound_1';
        indexSpecs.push({
          key: keys,
          options: { ...options, name: indexName, background: true }
        });
      }

      // Create indexes one by one
      for (const spec of indexSpecs) {
        try {
          await collection.createIndex(spec.key, spec.options);
          console.log(`✅ Created index: ${spec.options.name} for ${model.modelName}`);
        } catch (indexError) {
          if (!indexError.message.includes('already exists')) {
            console.warn(`⚠️ Could not create index ${spec.options.name}:`, indexError.message);
          }
        }
      }
      
    } catch (error) {
      console.error(`❌ Error creating indexes for ${model.modelName}:`, error.message);
      throw error;
    }
  }

  async resetCollectionIndexes(model) {
    try {
      const collection = model.collection;
      
      // Drop all indexes at once
      await collection.dropIndexes();
      console.log(`🗑️ All indexes dropped for ${model.modelName}`);
      
      // Wait for the operation to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Recreate indexes
      await this.createModelIndexes(model);
      
    } catch (error) {
      console.error(`❌ Collection reset failed for ${model.modelName}:`, error.message);
      throw error;
    }
  }

  // Utility method to get connection statistics
  getConnectionStats() {
    const conn = mongoose.connection;
    return {
      readyState: conn.readyState,
      name: conn.name,
      host: conn.host,
      port: conn.port,
      collections: Object.keys(conn.collections),
      models: Object.keys(mongoose.models)
    };
  }

  // Method to safely close connection
  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('🔌 MongoDB disconnected successfully');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
      throw error;
    }
  }
}

// Export a singleton instance
module.exports = new DatabaseConfig();