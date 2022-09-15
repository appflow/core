/**
 * Validate that the `$flow` get cleared on each test.
 * In other words - ensuring that `setup.ts` is working correctly.
 */
import '../src/'

describe( '$flow', () => {
    it( 'Add something for next test', () => {
        // Arrange
        $flow.managers().controllers.register( new class MyController extends $flow.Controller {
            static getName() {
                return 'Test/Controller'
            }

            getCommands(): { [ p: string ]: any } {
                return {
                    'test': class extends $flow.commandBases().CommandPublic {}
                }
            }
        } );

        // Validate controller is registered.
        expect( $flow.managers().controllers.get( 'Test/Controller' ) ).toBeDefined();
    } );

    it( 'validate commands being refreshed each test', () => {
        // The prev test `add something` which is the assertion.

        // Assert - Commands is empty.
        expect( $flow.managers().commands.getAll() ).toEqual( {} );
    } );
} );
