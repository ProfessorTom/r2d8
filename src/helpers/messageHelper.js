const constants = require( './constants.js' );
const helpers = require( '../helpers/helpers' );
const karma = require( '../karma' );
const bot = require( '../bot' );
const logger = require( '../logger' );

const messageIsFromABot = function( event ) {
    if ( event.type === 'message' && ( event.subtype === 'bot_message' ||
      ( !helpers.isEmpty( event.bot_profile ) && !helpers.isEmpty( event.bot_profile.name ) ) ) ) {
        return true;
    }
    return false;
};

const getMessageResponse = function( event ) {
    const message = event.text;
    console.log( 'immediate message: ' + message );
    let response = '';

    if( helpers.isEmpty( message ) || messageIsFromABot( event ) ) {
        return response;
    }

    const whereIs = new RegExp( `where is ${process.env.ROBOT_NAME}`, 'i' );
    const whereIsUserId = new RegExp( `where is <@${process.env.BOT_ID}>`, 'i' );

    const wheres = new RegExp( `where.s ${process.env.ROBOT_NAME}`, 'i' );
    const wheresUserId = new RegExp( `where.s <@${process.env.BOT_ID}>`, 'i' );

    const thanks = new RegExp( `thanks ${process.env.ROBOT_NAME}`, 'i' );
    const thanksUserId = new RegExp( `thanks <@${process.env.BOT_ID}>`, 'i' );

    const thankYou = new RegExp( `thank you ${process.env.ROBOT_NAME}`, 'i' );
    const thankYouUserId = new RegExp( `thank you <@${process.env.BOT_ID}>`, 'i' );

    const welcome = new RegExp( '^!welcome', 'i' );

    const addKarma = new RegExp( '.+[++]' );
    const subtractKarma = new RegExp( '.+[--]' );

    if ( message.match( addKarma ) ) {
        const channel = event.channel;
        console.log( 'message in addKarma if: ' + message );
        
        // pull ++ off end of string
        let noIncrementString = message.substring( 0, message.length - 2 );
        console.log( 'noIncrementString: ' + noIncrementString );
        // TODO: remove '', "", or ()
        
        karma.increment( noIncrementString ).then( ( response ) => {
            console.log( 'got into then of karma.increment in getMessageResponse' );
            bot.getBot().postMessage( channel, response, {
                as_user: true,
                link_names: true
            } );
        } );
    }
    
    else if( message.match( subtractKarma ) ) {
        const channel = event.channel;
        
        // pull -- off end of string
        let noDecrementString = message.substring( 0, message.length - 2 );
        // TODO: remove '', "", or ()
        
        karma.decrement( noDecrementString ).then( ( response ) => {
            bot.getBot().postMessage( channel, response, {
                as_user: true,
                link_names: true
            } );
        } );

    }
    // user example: where is R2D8?
    // user example: where's R2D8?
    else if ( message.match( whereIs ) != null || message.match( wheres ) != null
        || message.match( whereIsUserId ) != null || message.match( wheresUserId ) != null ) {
        response = `There is no ${process.env.ROBOT_NAME}. There is only Zuul.`;
    }

    // user example: thank you R2D8
    // user example: thanks R2D8
    else if ( message.match( thanks ) != null || message.match( thankYou ) != null
      || message.match( thanksUserId ) != null || message.match( thankYouUserId ) != null ) {
        response = 'At your service.';
    }

    // user example: top o the morn
    // user example: top of the morn
    // user example: top o the mornin
    // user example: top of the mornin
    // user example: top o the morning
    // user example: top of the morning
    else if ( message.match( /\btop o.? the (morn|mornin)/i ) != null ) {
        response = 'And the rest of the day to yas.';
    }
    // On 6.2.2020, typing "@channel" in Slack gets sent to the bot as "!channel"
    // we'll cover both cases in case Slack changes its mind.

    // user example: @channel
    else if ( message.match( /(@|!)channel/ ) != null ) {
    // response = 'Please use `@here` for group notifications instead. This is a thoughtful alternative that avoids unnecessary notifications sent to inactive users. (Repeated `@channel` usage is considered a CoC violation.)';
        response = constants.USE_HERE_INSTEAD;
    }
    // user example: !welcome
    else if ( ( message.match( welcome ) != null ) &&
      ( process.env.ENABLE_WELCOME_MESSAGE === 'true' || process.env.ENABLE_WELCOME_MESSAGE === true ) ) {
        response = constants.WELCOME_MESSAGE;
    }

    return response;
};

module.exports = {
    messageIsFromABot,
    getMessageResponse
};