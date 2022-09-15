import '../../src/'

describe( 'managers', () => {
    describe( 'commands', () => {
        test( 'getCommandInstance()', () => {
            // Arrange.
            const controller = $flow.managers().controllers.register( new class MyController extends $flow.Controller {
                    static getName() {
                        return 'Test/Controller'
                    }
                } ),
                MyCommand = class MyCommand extends ( $flow.commandBases().CommandPublic ) {
                    static getName() {
                        return 'Test/Controller/Test/Command';
                    }
                }

            // Register new controller.
            $flow.managers().commands.register( [ MyCommand ], controller );

            // Act - Get command instance.
            const command = $flow.managers().commands.getCommandInstance( 'Test/Controller/Test/Command' );

            // Assert.
            expect( command.getName() ).toBe( MyCommand.getName() );
        } );

        test( 'run()', async () => {
            // Arrange
            let didTestCommandRun = false;

            // Register new controller.
            $flow.managers().controllers.register( new class MyController extends $flow.Controller {
                static getName() {
                    return 'Test/Controller'
                }

                getCommands() {
                    return {
                        'some-key': class MyCommand extends ( $flow.commandBases().CommandPublic ) {
                            static getName() {
                                return 'Test/Controller/Test/Command';
                            }

                            apply() {
                                didTestCommandRun = true;
                            }
                        }
                    }
                }
            } )

            // Act - Run command.
            await $flow.managers().commands.run( 'Test/Controller/Test/Command' );

            // Assert - Check if command ran.
            expect( didTestCommandRun ).toBe( true );
        } );

        test( 'register()', () => {
            // Arrange.
            const controller = $flow.managers().controllers.register( new class MyController extends $flow.Controller {
                    static getName() {
                        return 'Test/Controller'
                    }
                } ),
                MyCommand = class MyCommand extends (  $flow.commandBases().CommandPublic ) {
                    static getName() {
                        return 'Test/Controller/Test/Command';
                    }
                };

            // Act - Register new controller.
            $flow.managers().commands.register( [ MyCommand ], controller );

            const command = $flow.managers().commands.getByName( MyCommand.getName() );

            // Assert.
            expect( command.getName() ).toBe( MyCommand.getName() );
        } );
    } );
} );
