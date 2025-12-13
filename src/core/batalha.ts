import { Personagem } from "../modelos/Personagem";
import { Acao } from "../modelos/Acao";

export class Batalha {
    personagens: Personagem[] = [];
    acoes: Acao[] = [];
    _idSequencial: number = 1;

    gerarId(): number {
        return this._idSequencial++;
    }

    atualizarUltimoId(): void {
        if (this.personagens.length > 0) {
            const maiorId = Math.max(...this.personagens.map(p => p.id));
            this._idSequencial = maiorId + 1;
        }
    }

    adicionarPersonagem(personagem: Personagem): void {
        for (const p of this.personagens) {
            if (p.nome === personagem.nome) {
                throw new Error("Já existe um personagem com este nome!");
            }
        }
        this.personagens.push(personagem);
        console.log("✅ Personagem adicionado: " + personagem.nome);
    }
    
    consultarPersonagem(nomeBuscado: string): Personagem {
        for (const p of this.personagens) {
            if(p.nome === nomeBuscado) return p;
        }
        throw new Error("Personagem não encontrado");
    }

    turno(atacanteId: number, defensorId: number): Acao[] {
        let atacante: Personagem | null = null;
        let defensor: Personagem | null = null;

        for (const p of this.personagens) {
            if (p.id === atacanteId) atacante = p;
            if (p.id === defensorId) defensor = p;
        }
        
        if (atacante === null) throw new Error("Atacante não encontrado");
        if (defensor === null) throw new Error("Defensor não encontrado");
        if (atacante === defensor) throw new Error("Personagem não pode atacar a si mesmo");
        if (!atacante.estaVivo) throw new Error ("Personagem morto não pode atacar");
        if (!defensor.estaVivo) throw new Error ("Personagem morto não pode ser atacado");

        const acao = atacante.atacar(defensor);
        this.acoes.push(acao);

        return [acao];
    }

    listarPersonagens(): Personagem[] { return this.personagens; }
    listarAcoes(): Acao[] { return this.acoes; }

    verificarVencedor(): Personagem | null {
        let contadorVivos = 0;
        let ultimoVivo: Personagem | null = null;

        for(const p of this.personagens) {
            if (p.estaVivo) {
                contadorVivos++;
                ultimoVivo = p;
            }
        }
        if (contadorVivos === 1) return ultimoVivo;
        return null;
    }
}