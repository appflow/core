import "../../src"
import { CommandArgsInterface } from "../../src/interfaces/commands";

describe( 'command-bases' , () => {
    describe( 'command-base', () => {
        test( 'initialize()', () => {
            // Arrange.
            const args: CommandArgsInterface = {
                    test: 'test',
                },
                options = {
                    test: 'test',
                };

            const CommandClass = class Command extends $flow.commandBases().CommandBase {
                static getName() {
                    return 'Flow/Commands/Command/Test'
                }
            };

            const instance = new CommandClass( args, options );

            // Act.
            instance.initialize( args, options )

            // Assert.
            expect( instance.getArgs() ).toEqual( args );
            expect( instance.getOptions() ).toEqual( options );
        } );

        test( 'apply()', () => {
            // Arrange.
            const CommandClass = class Command extends $flow.commandBases().CommandBase {
                public passed: boolean;

                static getName() {
                    return 'Flow/Commands/Command/Test'
                }


                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                apply( args: CommandArgsInterface = this.args, options: {} = this.options ) {
                    if ( args.passed ) {
                        this.passed = true;
                    }
                }
            };

            const instance = new CommandClass( { passed: true } );

            // Act.
            instance.run();

            // Assert.
            expect( instance.passed ).toBe( true );
        } )
    } );
} );
