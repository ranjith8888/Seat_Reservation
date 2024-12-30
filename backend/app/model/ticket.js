module.exports = (sequelize, Sequelize) => {
    const Ticket = sequelize.define("Ticket", {
      ticketsRemaining: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  
    return Ticket;
  };