import * as fs from 'fs';
import { Batalha } from "../core/batalha";
import { Personagem } from "../modelos/Personagem";
import { Guerreiro } from "../modelos/Guerreiro";
import { Mago } from "../modelos/Mago";
import { Arqueiro } from "../modelos/Arqueiro";
import { Necromante } from "../modelos/Necromante";
import { Templario } from "../modelos/Templario";

export function salvarJogo(batalha: Batalha): void {
    try {
        const dados = JSON.stringify(batalha.listarPersonagens(), null, 2);
        fs.writeFileSync('dados.json', dados);
        console.log("💾 Jogo salvo com sucesso em 'dados.json'.");
    } catch (e) {
        console.log("❌ Erro ao salvar:", e);
    }
}

export function carregarJogo(batalha: Batalha): void {
    try {
        if (!fs.existsSync('dados.json')) return;

        const arquivo = fs.readFileSync('dados.json', 'utf-8');
        const dados = JSON.parse(arquivo);

        batalha.personagens = []; 

        for (const obj of dados) {
            let p: Personagem;

            if (obj.hasOwnProperty('_defesa')) { 
                p = new Guerreiro(obj._id, obj._nome, obj._ataque, obj._defesa, obj._vidaMaxima);
            } else if (obj.hasOwnProperty('_ataqueMultiplo')) { 
                p = new Arqueiro(obj._id, obj._nome, obj._ataque, obj._ataqueMultiplo, obj._vidaMaxima);
            } else if (obj.hasOwnProperty('_taxaDrenagem')) {
                p = new Necromante(obj._id, obj._nome, obj._ataque, obj._vidaMaxima);
            } else if (obj.hasOwnProperty('_bonusSagrado')) {
                p = new Templario(obj._id, obj._nome, obj._ataque, obj._vidaMaxima);
            } else { 
                p = new Mago(obj._id, obj._nome, obj._ataque, obj._vidaMaxima);
            }
            
            (p as any)._vida = obj._vida; 
            batalha.adicionarPersonagem(p);
        }
        
        batalha.atualizarUltimoId();
        console.log(`📂 Jogo carregado: ${dados.length} personagens recuperados.`);
    } catch (e) {
        console.log("❌ Erro ao carregar:", e);
    }
}