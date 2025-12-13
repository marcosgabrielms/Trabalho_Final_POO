import { Personagem } from "./Personagem";
import { Acao } from "./Acao";

export class Necromante extends Personagem {
    private _taxaDrenagem: number = 10; 

    constructor(id: number, nome: string, ataque: number, vidaInicial: number = 100) {
        super(id, nome, ataque, vidaInicial);
    }

    atacar(alvo: Personagem): Acao {
        let valorAtaque = this._ataque;
        let msg = `Magia Sombria`;

        if (Math.random() < 0.50) {
            this._vida += this._taxaDrenagem;
            if (this._vida > this._vidaMaxima) this._vida = this._vidaMaxima;
            msg += " 💀 (CEIFADOR DE ALMAS: Roubou vida!)";
            console.log(`   💀 ${this.nome} drenou a energia vital e recuperou ${this._taxaDrenagem} PV!`);
        }

        console.log(`\n🔮 ${this.nome} lança ${msg} em ${alvo.nome}!`);
        alvo.receberDano(valorAtaque);

        const idAcao = Date.now();
        const acao = new Acao(idAcao, this.nome, alvo.nome, msg, valorAtaque);
        this.registrarAcao(acao);
        return acao;
    }
}