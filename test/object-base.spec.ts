import "../src/"

describe( 'ObjectBase', () => {
    test( 'constructor()', () => {
        // Arrange.
        const core = new class core1 extends $flow.ObjectBase{} (),
            core2 = new class core2 extends $flow.ObjectBase{} ();

        // Act.
        const id1 = core.virtualId,
            id2 = core2.virtualId;

        // Assert.
        expect( id1 ).toBe( 0 );
        expect( id2 ).toBe( 1 );
    } );

    test( 'getName()', () => {
        // Arrange.
        const core = class extends $flow.ObjectBase {
            getName() {
                return 'Flow/Test/GetName'
            }
        }

        // Act.
        const name = new core().getName();

        // Assert.
        expect( name ).toBe( 'Flow/Test/GetName' );
    } )

    test( 'getName() : With foreMethodImplementation', () => {
        // Arrange.
        const core = new class core extends $flow.ObjectBase{} ();

        // Act.
        expect( () => {
            core.getName();
        } ).toThrow( `ForeMethod implementation: at 'Flow/Core' method: 'getName'` );
    } );
} );
