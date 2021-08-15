// require the needed discord.js classes
const { Client, Intents, MessageEmbed } = require('discord.js');
const clientDiscord = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

clientDiscord.login("ODc2MzY1NDAxNTgyMzU4NTY5.YRjA4Q.xr_mOpleZKsML1XEllT3chuvqps"); // Activation du bot en ligne
////////////////////////////////////////////////////////////////////////////////////////////////////

// DOT ENV 
const dotenv = require("dotenv");
dotenv.config();
///////////////////////////////////

// PG SQL
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DATABASE_USER_NAME,
  host: "localhost",
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});
////////////////////////////////////////

// FUNCTION QUI RECHERCHE LE NOMBRE DE GUILDE EN ATTENTE D'ETRE ACCEPTE
let value = -1
let oldValue = 0
let increment = 0
function findGuildWhoNeedToBeAccepted() {

    pool.connect((err, client, release) => {
        client.query("SELECT count(*) FROM public.account where role = 'guild' and banned = false and actif = false", (err, results) => {
        release();
        if(err) return console.log(err);
        value = results.rows[0].count
        if(value > oldValue){
            oldValue = value
            if (increment > 0){
                clientDiscord.channels.cache.get('876397941915516938').send('Nouvelle demande de guilde')
            }
            else {
                increment = increment + 1
            }
        }
        else if( value < oldValue) {
            oldValue = value
            clientDiscord.channels.cache.get('876397941915516938').send('Un douanier vient de passer !')
        }
        });
    });
  }
  /////////////////////////////////////////////////////////////////////////////

// Chèque toutes les minutes si une nouvelle guilde a été accepté ou demandé.
clientDiscord.once("ready", () => {
    setInterval(findGuildWhoNeedToBeAccepted, 60000);
});
/////////////////////////////////////////////////////////////////////////////

