const { Sequelize, DataTypes, UUIDV4, Op } = require("sequelize");
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const scrape = require("./scrape.js");
var cron = require("node-cron");

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize("tcgtracker", "postgres", "password", {
  host: "localhost",
  dialect: "postgres",
});

const Card = sequelize.define("Card", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  tcgplayer_id: DataTypes.INTEGER,
  url: DataTypes.STRING,
  product_line: DataTypes.STRING,
  set: DataTypes.STRING,
  product: DataTypes.STRING,
  rarity: DataTypes.STRING,
  number: DataTypes.STRING,
});

const CardPrice = sequelize.define("CardPrice", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  CardId: {
    type: DataTypes.UUID,
    references: {
      model: Card,
      key: "id",
    },
  },
  market_price: DataTypes.DECIMAL,
  median_price: DataTypes.DECIMAL,
  date: DataTypes.DATE,
  price_difference: DataTypes.DECIMAL,
});

Card.hasMany(CardPrice, {
  foreignKey: "CardId",
});

CardPrice.belongsTo(Card);

// //Card Update
// (async () => {
//   await sequelize.sync({ force: false });
//   const cardList = await scrape.getPriceFeed();
//   cardList.forEach(async (card) => {
//     const cardExists = await Card.findAll({
//       where: {
//         tcgplayer_id: card.id,
//       },
//     });

//     if (cardExists.length == 0) {
//       const NewCard = await Card.create({
//         tcgplayer_id: card.id,
//         url: card.url,
//         product_line: card.productLine,
//         set: card.set,
//         product: card.product,
//         rarity: card.rarity,
//         number: card.number,
//       });
//     }
//   });
// })();

// //CardPricesUpdate
// (async () => {
//   await sequelize.sync({ force: false });
//   const cardList = await scrape.getPriceFeed();
//   cardList.forEach(async (card) => {
//     const cardExists = await Card.findAll({
//       where: {
//         tcgplayer_id: card.id,
//       },
//     });

//     if (cardExists.length != 0) {
//       const prevPriceModel = await CardPrice.findOne({
//         where: { CardId: cardExists[0].id },
//         order: [["createdAt", "DESC"]],
//       });

//       if (
//         prevPriceModel &&
//         !isNaN(prevPriceModel.market_price) &&
//         !isNaN(card.marketPrice) &&
//         prevPriceModel.market_price != card.marketPrice
//       ) {
//         const NewCardPrice = await CardPrice.create({
//           CardId: cardExists[0].id,
//           median_price: card.medianPrice,
//           market_price: card.marketPrice,
//           date: card.date,
//           price_difference:
//             prevPriceModel == null
//               ? 0
//               : card.marketPrice - prevPriceModel.market_price,
//         });
//       }
//     }
//   });
// })();

// //Scheduled at 12
// cron.schedule('00 12 * * *', () => {
//     (async () => {
//         await sequelize.sync({ force:false });
//         const cardList = await scrape.getPriceFeed();
//         cardList.forEach( async (card) => {
//             const cardExists = await Card.findAll({
//                 where: {
//                     tcgplayer_id: card.id
//                 }
//             });

//             const NewCardPrice = await CardPrice.create({
//                 card_id: cardExists.id,
//                 market_price: card.marketPrice,
//                 median_price: card.medianPrice,
//                 date: card.date
//             })
//         })
//     })();
// });

//ROUTES//
// Search for a specific card using product
app.get("/Cards/byProduct", async (req, res) => {
  try {
    const { product } = req.query;
    const cards = await Card.findAll({
      where: Sequelize.where(
        Sequelize.fn(
          "concat",
          Sequelize.col("set"),
          " ",
          Sequelize.col("product"),
          " ",
          Sequelize.col("number"),
          " ",
          Sequelize.col("product_line")
        ),
        {
          [Op.iLike]: `%${product}%`,
        }
      ),
    });
    return res.json(cards);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Search for a specific card using CardId
app.get("/Cards/byCardId/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const card = await Card.findOne({ 
      where: {
        id: id
      }
    });

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    return res.send(card);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all CardPrices for a specific card by CardId
app.get("/CardPrices/byCardId", async (req, res) => {
  try {
    const { CardId } = req.query;

    const cardPrices = await CardPrice.findAll({
      where: { CardId: CardId },
      order: [["date", "ASC"]],
    });

    return res.json(cardPrices);
  } catch (err) {
    console.error(err.message);
  }
});

//Get largest price change alltime
app.get("/CardPrices/price_difference/alltime", async (req, res) => {
  try {
    const cardPrices = await CardPrice.findAll({
      limit: 20,
      attributes: [
        "CardId",
        [
          sequelize.fn("sum", sequelize.col("price_difference")),
          "total_price_difference",
        ],
      ],
      group: ["CardId"],
      order: [[Sequelize.col("total_price_difference"), "DESC"]],
    });

    res.json(cardPrices);
  } catch (err) {
    console.error(err.message);
  }
});

//Get largest price change daily
app.get("/CardPrices/price_difference/daily", async (req, res) => {
  try {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    // today.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 0);

    const cardChanges = await CardPrice.findAll({
      limit: 20,
      attributes: [
        "CardId",
        [
          sequelize.fn("sum", sequelize.col("price_difference")),
          "total_price_difference",
        ],
      ],
      group: ["CardId"],
      where: {
        date: {
          [Op.between]: [today, endOfDay],
        },
      },
      order: [[Sequelize.col("total_price_difference"), "DESC"]],
    });

    const cards = await Card.findAll({
      where: {
        id: {
          [Op.in]: cardChanges.map((cardChange) => cardChange.CardId),
        },
      },
    });

    

    res.send(cards);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
