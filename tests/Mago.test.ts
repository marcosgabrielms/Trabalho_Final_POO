import { Mago } from "../src/modelos/Mago";
import { Guerreiro } from "../src/modelos/Guerreiro";

describe("🔮  CLASSE MAGO", () => {
    beforeEach(() => { jest.spyOn(console, 'log').mockImplementation(() => {}); });
    afterAll(() => { jest.restoreAllMocks(); });

    test("✅ Deve gastar 10 de vida ao atacar", () => {
        const mago = new Mago(1, "Merlin", 20);
        const alvo = new Guerreiro(2, "Arthur", 20, 0);
        mago.atacar(alvo);
        expect(mago.vida).toBe(90); // 100 - 10
    });

    test("⚡ Deve ignorar a defesa do Guerreiro (Dano Verdadeiro)", () => {
        const mago = new Mago(1, "Merlin", 20);
        const guerreiro = new Guerreiro(2, "Tank", 20, 50); // Defesa 50
        mago.atacar(guerreiro);
        // Dano 20 deve entrar cheio, ignorando a defesa 50
        expect(guerreiro.vida).toBe(80);
    });
});