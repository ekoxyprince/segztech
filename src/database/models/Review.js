const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_verified'
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['product_id'] },
    { fields: ['created_at'] }
  ]
});

Review.associate = (models) => {
  Review.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  Review.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
};

module.exports = Review;
