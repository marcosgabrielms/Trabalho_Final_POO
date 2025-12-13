import { Personagem } from "./Personagem";
import { Acao } from "./Acao";

export class Guerreiro extends Personagem {
    private _defesa: number;

    constructor(id: number, nome: string, ataque: number, defesa: number, vidaInicial: number = 100) {
        super(id, nome, ataque, vidaInicial);
        this._defesa = defesa;
    }

    public receberDano(valor: number): void {
        if (valor < this._defesa) {
            console.log(`   🛡️ ${this.nome} Defendeu totalmente! (Defesa ${this._defesa} > Ataque ${valor})`);
            return;
        }
        const danoReal = valor - this._defesa;
        console.log(`   🛡️ Defesa reduziu o impacto em ${this._defesa}.`);
        super.receberDano(danoReal);
    }
    
    atacar(alvo: Personagem): Acao {
        let valorAtaque = this._ataque;
        let msg = `Ataque de Espada`;
        
        if (this._vida < (this._vidaMaxima * 0.3)){
            valorAtaque = valorAtaque * 1.3;
            valorAtaque = Math.floor(valorAtaque); 
            msg += " 🔥 (FÚRIA +30%)";
            console.log(`   🔥 ${this.nome} está enfurecido! Dano aumentado.`);
        }
        console.log(`\n⚔️  ${this.nome} ATACA ${alvo.nome}!`);
        alvo.receberDano(valorAtaque);

        const idAcao = Date.now();
        const acao = new Acao(idAcao, this.nome, alvo.nome, msg, valorAtaque);
        this.registrarAcao(acao);
        return acao;             
    }
}