import { Arqueiro } from "../src/modelos/Arqueiro";
import { Guerreiro } from "../src/modelos/Guerreiro";

describe("🏹  CLASSE ARQUEIRO", () => {
    beforeEach(() => { jest.spyOn(console, 'log').mockImplementation(() => {}); });
    afterAll(() => { jest.restoreAllMocks(); });

    test("✅ Deve causar dano normal (sem crítico)", () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.9); // Força falha no crítico
        
        const arqueiro = new Arqueiro(1, "Legolas", 20);
        const alvo = new Guerreiro(2, "Orc", 20, 0);
        arqueiro.atacar(alvo);
        
        expect(alvo.vida).toBe(80);
        jest.spyOn(global.Math, 'random').mockRestore();
    });

    test("🎲 Deve ativar Ataque Múltiplo (Crítico)", () => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.1); // Força sucesso
        
        const arqueiro = new Arqueiro(1, "Legolas", 10, 3); // 10 dano, 3x multi
        const alvo = new Guerreiro(2, "Orc", 100, 0);
        arqueiro.atacar(alvo);
        
        // 10 * 3 = 30 de dano
        expect(alvo.vida).toBe(70);
        jest.spyOn(global.Math, 'random').mockRestore();
    });
});