require( 'dotenv' ).config();
const logger = require( './src/logger' );
const bot = require( './src/bot' );
const server = require( './src/server' );
const karma = require( './src/helpers/karma' );
const karmaHelpers = require( './src/helpers/karmaHelpers' );
//require database
const db = require( './config/database' );
const sequelize = require( 'sequelize' );

//testDB
// db.authenticate()
//     .then( () => console.log( 'database connected...' ) )
//     .catch( ( err ) => console.log( 'Error ' + err ) );

const data = {
    message: 'this is a test',
    points: 32,
};

// karmaHelpers.updatePhrase( data.message, data.points );
// karma.increment( data.message ).then( ( userString ) => {
//     console.log( 'userString: ' + userString );
// } );

// Start the bot
bot.startBot();

// Start the server so we have a page we can load
// Without this the app will crash because Heroku would have nothing to load
server.listen( process.env.PORT, function() {
    logger.log( 'debug', `Server started running on port ${process.env.PORT}.` );
} );