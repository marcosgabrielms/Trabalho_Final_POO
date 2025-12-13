import { Templario } from "../src/modelos/Templario";
import { Necromante } from "../src/modelos/Necromante";
import { Guerreiro } from "../src/modelos/Guerreiro";

describe("☀️  CLASSE TEMPLÁRIO", () => {
    beforeEach(() => { jest.spyOn(console, 'log').mockImplementation(() => {}); });
    afterAll(() => { jest.restoreAllMocks(); });

    test("✅ Deve causar dano normal em não-Necromantes", () => {
        const templario = new Templario(1, "Uther", 20);
        const alvo = new Guerreiro(2, "Bandido", 20, 0);
        templario.atacar(alvo);
        expect(alvo.vida).toBe(80);
    });

    test("✨ Deve causar DANO DOBRADO em Necromantes (Golpe Divino)", () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.1); // Força ativação
        
        const templario = new Templario(1, "Uther", 20); // Dano base 20, Bonus x2
        const alvo = new Necromante(2, "Lich", 20, 100);
        templario.atacar(alvo);
        
        // Dano 20 * 2 = 40. Vida 100 - 40 = 60
        expect(alvo.vida).toBe(60);
        jest.spyOn(global.Math, 'random').mockRestore();
    });
});