import { Necromante } from "../src/modelos/Necromante";
import { Guerreiro } from "../src/modelos/Guerreiro";

describe("💀  CLASSE NECROMANTE", () => {
    beforeEach(() => { jest.spyOn(console, 'log').mockImplementation(() => {}); });
    afterAll(() => { jest.restoreAllMocks(); });

    test("🩸 Deve roubar vida (Lifesteal) quando ativado", () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.1); // Força ativação
        
        const necro = new Necromante(1, "Kel'Thuzad", 20);
        (necro as any)._vida = 50; // Começa com metade da vida
        
        const alvo = new Guerreiro(2, "Humano", 20, 0);
        necro.atacar(alvo);
        
        // Vida inicial 50 + 10 roubados = 60
        expect(necro.vida).toBe(60);
        jest.spyOn(global.Math, 'random').mockRestore();
    });
});