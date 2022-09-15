import '../../src/'

describe("managers", () => {
    describe( 'controllers', () => {
        test( 'get() & register()', () => {
            // Arrange.
            const controller = $flow.managers().controllers.register( new class MyController extends $flow.Controller {
                    static getName() {
                        return 'Test/Controller'
                    }
                } );


            // Act - Get controller.
            const result = $flow.managers().controllers.get( controller.getName() );

            // Assert.
            expect( result.getName() ).toBe( controller.getName() );
        } );
    } );
} );
