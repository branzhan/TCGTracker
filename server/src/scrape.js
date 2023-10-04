const axios = require('axios');
const cheerio = require('cheerio');

async function getPriceFeed() {
    let cardList = [];

    let productLine = ["pokemon"];
    let pokemonSets = ["swsh12-silver-tempest", "swsh12-silver-tempest-trainer-gallery",
    "swsh11-lost-origin", "swsh11-lost-origin-trainer-gallery", "trick-or-trade-booster-bundle", "mcdonalds-promos-2022",
    "pokemon-go", "swsh10-astral-radiance", "swsh10-astral-radiance-trainer-gallery", "battle-academy-2022", "swsh09-brilliant-stars",
    "swsh08-fusion-strike", "celebrations", "celebrations-classic-collection", "swsh07-evolving-skies", "swsh06-chilling-reign", "swsh05-battle-styles",
    "first-partner-pack", "shining-fates", "shining-fates-shiny-vault", "mcdonalds-25th-anniversary-promos", "swsh04-vivid-voltage", "champions-path", "swsh03-darkness-ablaze",
    "battle-academy", "swsh02-rebel-clash", "swsh01-sword-and-shield-base-set", "swsh-sword-and-shield-promo-cards", "swsh-sword-and-shield-promo-cards", 
    "mcdonalds-promos-2019", "hidden-fates", "hidden-fates-shiny-vault", "sm-unified-minds", "sm-unbroken-bonds", "detective-pikachu", "sm-team-up", "mcdonalds-promos-2018",
    "sm-lost-thunder", "miscellaneous-cards-and-products", "dragon-majesty", "sm-celestial-storm", "world-championship-decks", "sm-forbidden-light", "sm-trainer-kit-alolan-sandslash-and-alolan-ninetales",
    "sm-ultra-prism", "mcdonalds-promos-2017", "sm-crimson-invasion", "shining-legends", "sm-burning-shadows", "alternate-art-promos", "sm-guardians-rising", "sm-trainer-kit-lycanroc-and-alolan-raichu", 
    "sm-base-set", "sm-promos", "xy-evolutions", "deck-exclusives", "mcdonalds-promos-2016", "xy-steam-siege", "league-and-championship-cards", "xy-fates-collide", "xy-trainer-kit-pikachu-libre-and-suicune", 
    "generations", "generations-radiant-collection", "xy-breakpoint", "mcdonalds-promos-2015","xy-breakthrough", "xy-ancient-origins", "xy-roaring-skies", "xy-trainer-kit-latias-and-latios",
    "jumbo-cards", "double-crisis", "xy-primal-clash", "xy-trainer-kit-bisharp-and-wigglytuff", "xy-phantom-forces", "xy-furious-fists", "mcdonalds-promos-2014", "mcdonalds-promos-2014", "xy-trainer-kit-sylveon-and-noivern",
    "xy-base-set", "xy-promos", "legendary-treasures", "legendary-treasures-radiant-collection", "plasma-blast", "plasma-freeze", "plasma-storm", "boundaries-crossed", "dragons-exalted", 
    "dark-explorers", "noble-victories", "bw-trainer-kit-excadrill-and-zoroark","emerging-powers", "black-and-white", "call-of-legends", "professor-program-promos", "triumphant", "undaunted", "pikachu-world-collection-promos",
    "unleashed", "hgss-promos"];

    // "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","", "", ""
    let yugiohSets = [""];

    try {
        //Looping through pokemon product sets
        for (let i = 0; i < pokemonSets.length; i++) {
            let productList = [];
            let rarityList = [];
            let numberList = [];
            let marketList = [];
            let medianList = [];
            let oddIdList = [];
            let evenIdList = [];
            let idList = [];
        
            const siteUrl = `https://prices.tcgplayer.com/price-guide/${productLine[0]}/${pokemonSets[i]}`;


            const { data } = await axios({
                method: "GET",
                url: siteUrl,
            });

            const $ = cheerio.load(data);

            $('.odd').each((i, el) => {
                const idText = $(el)
                    .attr('id');
                
                oddIdList[i] = idText;
            });

            $('.even').each((i, el) => {
                const idText = $(el)
                    .attr('id');

                evenIdList[i] = idText;
            });

            //Alternate elements of the odd and even array into one array
            for (let i = 0; i < evenIdList.length; i++) {
                idList.push(evenIdList[i], oddIdList[i]);
            }

            $('.product').each((i, el) => {
                const productText = $(el)
                    .text()
                    .trim();
                
                productList[i] = productText;
            });

            $('.rarity').each((i, el) => {
                const rarityText = $(el)
                    .text()
                    .trim();
                
                rarityList[i] = rarityText;
            });

            $('.number').each((i, el) => {
                const numberText = $(el)
                    .text()
                    .trim();
                
                numberList[i] = numberText;
            });

            $('.marketPrice').each((i, el) => {
                const marketText = $(el)
                    .text()
                    .trim();
                
                marketList[i] = marketText;
            });

            $('.medianPrice').each((i, el) => {
                const medianText = $(el)
                    .text()
                    .trim();
                
                medianList[i] = medianText;
            });

            for (let j = 0; j < productList.length; j++) {
                //i is the current set
                //removing a char at the start
                let id = idList[j].substring(1);
                let imgUrl = `https://product-images.tcgplayer.com/fit-in/437x437/${id}.jpg`;
                let currentDate = new Date();
                const marketPrice = marketList[j] !== "" ? parseFloat(marketList[j].substring(1)) : 0;
                const medianPrice = medianList[j] !== "" ? parseFloat(medianList[j].substring(1)) : 0;
                cardList.push({id: id, url: imgUrl, productLine: productLine[0], set:pokemonSets[i], product: productList[j],
                rarity: rarityList[j], number: numberList[j], marketPrice, medianPrice, date: currentDate});
            }
        }
        return cardList;
    }

    catch (err) {
        console.error(err);
    }
}

module.exports = { getPriceFeed }