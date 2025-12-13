import { Guerreiro } from "../src/modelos/Guerreiro";

describe("🛡️  CLASSE GUERREIRO", () => {
    
    beforeEach(() => { jest.spyOn(console, 'log').mockImplementation(() => {}); });
    afterAll(() => { jest.restoreAllMocks(); });

    test("✅ Deve reduzir o dano baseado na defesa", () => {
        const guerreiro = new Guerreiro(1, "Thor", 100, 10); 
        guerreiro.receberDano(30);
        // 30 (dano) - 10 (defesa) = 20 dano real. 100 - 20 = 80.
        expect(guerreiro.vida).toBe(80);
    });

    test("✅ Não deve sofrer dano se o ataque for menor que a defesa", () => {
        const guerreiro = new Guerreiro(1, "Thor", 100, 10);
        guerreiro.receberDano(5);
        expect(guerreiro.vida).toBe(100);
    });

    test("🔥 Deve ativar a Fúria quando a vida estiver baixa (<30%)", () => {
        // Criamos um guerreiro com 20/100 de vida
        const guerreiro = new Guerreiro(1, "Kratos", 10, 0, 100);
        // Hack para setar vida diretamente protegida
        (guerreiro as any)._vida = 20; 
        
        const alvo = new Guerreiro(2, "Saco de Pancada", 100, 0);
        
        // Ataque base 10 + 30% = 13
        const acao = guerreiro.atacar(alvo);
        
        expect(acao.valorDano).toBe(13);
        expect(acao.descricao).toContain("FÚRIA");
    });
});