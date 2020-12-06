const parseKarma = require( '../parseKarma' );
const karma = require( '../../karma' );

describe( 'parseKarma', () => {
    let event = {};

    beforeEach( async() => {
        event.text = '';
    } );
    describe( 'increment', () => {
        beforeEach( async() => {
            karma.increment = jest.fn().mockResolvedValue( expectedString );
        } );
        const expectedString = 'foo: 1';
        test( 'calls karma.increment and returns its result ', async() => {
            event.text = 'foo++';
            
            const result = await parseKarma.handleKarma( event );
            expect( karma.increment ).toHaveBeenCalledTimes( 1 );
            expect( result ).toEqual( expectedString );
        } );
        test( 'in middle of string ', async() => {
            event.text = 'this is the foo++ song that never ends';
          
            const result = await parseKarma.handleKarma( event );
            expect( karma.increment ).toHaveBeenCalledTimes( 1 );
            expect( result ).toEqual( expectedString );
        } );
    } );
    describe( 'decrement', () => {
        const expectedString = 'foo: -1';

        beforeEach( () => {
            karma.decrement = jest.fn().mockResolvedValue( expectedString );
        } );
        test( 'calls karma.decrement and returns its result ', async() => {
            event.text = 'foo--';
            
            const result = await parseKarma.handleKarma( event );
            expect( karma.decrement ).toHaveBeenCalledTimes( 1 );
            expect( result ).toEqual( expectedString );
        } );
        test( 'in middle of string ', async() => {
            event.text = 'this is the foo-- that never ends';
            
            const result = await parseKarma.handleKarma( event );
            expect( karma.decrement ).toHaveBeenCalledTimes( 1 );
            expect( result ).toEqual( expectedString );
        } );
    } );

    describe( 'extractAsNeeded', () => {
        test( 'phrase surrounded by single quotes', () => {
            const phrase = '\'fooey\'';
            const returnedPhrase = parseKarma.extractAsNeeded( phrase );
            expect( returnedPhrase ).toEqual( 'fooey' );
        } );

        test( 'phrase surrounded by double quotes', () => {
            const phrase = '"fooby"';
            const returnedPhrase = parseKarma.extractAsNeeded( phrase );
            expect( returnedPhrase ).toEqual( 'fooby' );
        } );

        test( 'phrase surronded by parentheses', () => {
            const phrase = '(phooey)';
            const returnedPhrase = parseKarma.extractAsNeeded( phrase );
            expect( returnedPhrase ).toEqual( 'phooey' );
        } );
    } );
} );