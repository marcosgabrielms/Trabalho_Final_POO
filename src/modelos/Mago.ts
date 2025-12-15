import { Personagem } from "./Personagem";
import { Acao } from "./Acao";
import { Arqueiro } from "./Arqueiro";
import { Guerreiro } from "./Guerreiro";

export class Mago extends Personagem {
    constructor(id: number, nome: string, ataque: number, vidaInicial: number = 100) {
        super(id, nome, ataque, vidaInicial);
    }

    atacar(alvo: Personagem): Acao {
        let valorAtaque = this._ataque;
        let msg = `Magia Arcana`;

        console.log(`\n✨ ${this.nome} Conjura uma magia em ${alvo.nome}!`);
        
        this._vida -= 10;
        
        if (this._vida < 0) {
            this._vida = 0;
        }

        console.log(`   💧 ${this.nome} gastou 10 PV para usar magia.`);

        if (alvo instanceof Arqueiro) {
            valorAtaque = valorAtaque * 2;
            msg += " 🎯 (Crítico vs Arqueiro)";
            console.log(`   🎯 Dano DOBRADO pela vulnerabilidade do Arqueiro!`);
        }
        
        if (alvo instanceof Guerreiro) {
            msg += " ⚡ (Ignorou Defesa)";
            alvo.receberDanoVerdadeiro(valorAtaque);
        } else {
            alvo.receberDano(valorAtaque);
        }

        const idAcao = Date.now();
        const acao = new Acao(idAcao, this.nome, alvo.nome, msg, valorAtaque);
        this.registrarAcao(acao);

        this.registrarAcao(new Acao(idAcao + 1, this.nome, this.nome, "Custo de Mana", 10));

        return acao;
    }
}