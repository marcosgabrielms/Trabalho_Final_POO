import { Personagem } from "./Personagem";
import { Acao } from "./Acao";
import { Necromante } from "./Necromante";

export class Templario extends Personagem {
    private _bonusSagrado: number = 2;

    constructor(id: number, nome: string, ataque: number, vidaInicial: number = 100) {
        super(id, nome, ataque, vidaInicial);
    }

    atacar(alvo: Personagem): Acao {
        let valorAtaque = this._ataque;
        let msg = `Golpe de Maça`;

        if (alvo instanceof Necromante) {
            if (Math.random() < 0.35) {
                valorAtaque = valorAtaque * this._bonusSagrado;
                msg += " ☀️ (GOLPE DIVINO!)";
                console.log(`   ☀️ LUZ SAGRADA! ${this.nome} causou DANO DOBRADO!`);
            }
        }

        console.log(`\n🛡️ ${this.nome} desfere ${msg} em ${alvo.nome}!`);
        alvo.receberDano(valorAtaque);

        const idAcao = Date.now();
        const acao = new Acao(idAcao, this.nome, alvo.nome, msg, valorAtaque);
        this.registrarAcao(acao);
        return acao;
    }
}