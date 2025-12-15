import { Batalha } from "./core/batalha";
import { Guerreiro } from "./modelos/Guerreiro";
import { Mago } from "./modelos/Mago";
import { Arqueiro } from "./modelos/Arqueiro";
import { Necromante } from "./modelos/Necromante";
import { Templario } from "./modelos/Templario";
import { Personagem } from "./modelos/Personagem"; 
import { perguntar, fecharInterface } from "./utils/io";
import { salvarJogo, carregarJogo } from "./utils/armazenamento";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function lerInputComLimites(texto: string, min: number, max: number): Promise<number> {
    while (true) {
        const valorInput = await perguntar(`${texto} [Mín: ${min} | Máx: ${max}]: `);
        const valor = Number(valorInput);

        if (!isNaN(valor) && valor >= min && valor <= max) {
            return valor;
        }
        
        console.log(`❌ Valor inválido! Por favor, insira um valor entre ${min} e ${max}.`);
    }
}

function obterDetalhesClasse(p: Personagem): string {
    if (p instanceof Guerreiro) {
        return `(🛡️ Guerreiro | Defesa: ${(p as any)._defesa})`;
    } 
    if (p instanceof Arqueiro) {
        return `(🏹 Arqueiro | Crítico: ${(p as any)._ataqueMultiplo}x)`;
    }
    if (p instanceof Mago) {
        return `(✨ Mago | Dano Verdadeiro)`;
    }
    if (p instanceof Necromante) {
        return `(💀 Necromante | Roubo de Vida)`;
    }
    if (p instanceof Templario) {
        return `(☀️ Templário | Dano Sagrado)`;
    }
    return "";
}

async function main() {
    const batalha = new Batalha();

    console.log("==================================");
    console.log("      🏰  BATTLE ROYALE  🏰      ");
    console.log("==================================");

    carregarJogo(batalha);
    
    let rodando = true;
    
    while (rodando) {
        console.log("\n---  MENU PRINCIPAL ---");
        console.log("1. ➕ Criar Personagem");
        console.log("2. ⚔️  Realizar Batalha (Turno)");
        console.log("3. 📋 Listar Personagens (Status)");
        console.log("4. 📜 Ver Histórico de Ações"); 
        console.log("5. 💾 Salvar e Sair");     
        console.log("6. 👼 Menu de Ressurreição (Debug)");    
        console.log("7. 🤖 Batalha Automática (Battle Royale)");

        const op = await perguntar("=> Escolha uma opção: ");

        try {
            switch (op) {
                case "1":
                    console.log("\n### Criar Novo Lutador ###");
                    const nome = await perguntar("Nome do Personagem: ");
                    console.log("Classes Clássicas: [1] Guerreiro 🛡️  | [2] Mago ✨  | [3] Arqueiro 🏹");
                    console.log("Classes Extras:    [4] Necromante 💀 | [5] Templário ☀️");
                    const tipo = await perguntar("Escolha a classe: ");
                    
                    const id = batalha.gerarId();

                    if (tipo === "1") {
                        const PONTOS_GUERREIRO = 50;
                        console.log(`\n🛡️ GUERREIRO selecionado!`);
                        console.log(`🔹 Distribua até ${PONTOS_GUERREIRO} pontos entre ATAQUE e DEFESA.`);
                        
                        const maxAtaque = 30;
                        const atq = await lerInputComLimites("=> Quanto em ATAQUE?", 10, maxAtaque);
                        
                        const sobraParaDef = PONTOS_GUERREIRO - atq;
                        const maxDef = Math.min(sobraParaDef, 30); 
                        
                        const def = await lerInputComLimites(`=> Quanto em DEFESA? (Máximo disponível: ${maxDef})`, 10, maxDef);
                        
                        console.log(`✅ Personagem Criado: ${nome} (🛡️ Guerreiro | Atq: ${atq} | Def: ${def})`);
                        batalha.adicionarPersonagem(new Guerreiro(id, nome, atq, def));

                    } else if (tipo === "2") {
                        console.log(`\n✨ MAGO selecionado! (Dano Verdadeiro / Ignora Defesa)`);
                        const atq = await lerInputComLimites("=> Ataque Base (Poder Arcano)", 20, 35);
                        
                        console.log(`✅ Personagem Criado: ${nome} (✨ Mago | Atq: ${atq})`);
                        batalha.adicionarPersonagem(new Mago(id, nome, atq));

                    } else if (tipo === "3") {
                        console.log(`\n🏹 ARQUEIRO selecionado! (Dano Crítico Alto)`);
                        const atq = await lerInputComLimites("=> Ataque Base (Flecha)", 15, 25);
                        const multi = await lerInputComLimites("=> Multiplicador de Crítico", 2, 3);
                        
                        console.log(`✅ Personagem Criado: ${nome} (🏹 Arqueiro | Atq: ${atq} | Crítico: ${multi}x)`);
                        batalha.adicionarPersonagem(new Arqueiro(id, nome, atq, multi));

                    } else if (tipo === "4") {
                        console.log(`\n💀 NECROMANTE selecionado! (Roubo de Vida)`);
                        const atq = await lerInputComLimites("=> Ataque Base (Magia Negra)", 20, 35);
                        
                        console.log(`✅ Personagem Criado: ${nome} (💀 Necromante | Atq: ${atq})`);
                        batalha.adicionarPersonagem(new Necromante(id, nome, atq));

                    } else if (tipo === "5") {
                        console.log(`\n☀️ TEMPLÁRIO selecionado! (Guerreiro Sagrado Ofensivo)`);
                        const atq = await lerInputComLimites("=> Ataque Base (Martelo)", 25, 40);
                        
                        console.log(`✅ Personagem Criado: ${nome} (☀️ Templário | Atq: ${atq})`);
                        batalha.adicionarPersonagem(new Templario(id, nome, atq));

                    } else {
                        console.log("❌ Tipo inválido!");
                    }
                    break;

                case "2":
                    if (batalha.listarPersonagens().length < 2) {
                        console.log("⚠️  Precisa de pelo menos 2 personagens.");
                        break;
                    }

                    console.log("\n--- ⚔️  ARENA DE COMBATE ⚔️  ---");
                    batalha.listarPersonagens().forEach(p => {
                        const detalhes = obterDetalhesClasse(p);
                        if (p.estaVivo) console.log(`[ID: ${p.id}] ${p.nome} ${detalhes}`);
                    });

                    const id1 = Number(await perguntar("ID do Atacante: "));
                    const id2 = Number(await perguntar("ID do Alvo: "));

                    console.log("\n-----------------------------------------");
                    batalha.turno(id1, id2);
                    console.log("-----------------------------------------");

                    const vencedor = batalha.verificarVencedor();
                    if (vencedor) {
                        console.log(`\n🎉🏆 O VENCEDOR É: ${vencedor.nome} !!! 🏆🎉`);
                    } else {
                        const vivos = batalha.listarPersonagens().filter(p => p.estaVivo);
                        if (vivos.length === 0) {
                            console.log (`\n☠️  A BATALHA TERMINOU EM EMPATE! Todos morreram. ☠️`);
                        }
                    }
                    break;

                case "3":
                    console.log("\n--- 📊 STATUS ATUAL ---");
                    const lista = batalha.listarPersonagens();
                    if (lista.length === 0) console.log("(Vazio)");

                    for (const p of lista) {
                        const barras = "█".repeat(Math.ceil(p.vida / 10));
                        const status = p.estaVivo ? "Vivo" : "Morto 💀";
                        const detalhes = obterDetalhesClasse(p);
                        
                        console.log(`[${p.id}] ${p.nome.padEnd(10)} | Vida: ${p.vida.toString().padEnd(3)} ${barras} | ${status} ${detalhes}`);
                    }
                    break;

                case "4": 
                    console.log("\n--- 📜 HISTÓRICO DA BATALHA ---");
                    const logs = batalha.listarAcoes();
                    if (logs.length === 0) console.log("(Nenhuma ação registrada)");
                    
                    logs.forEach(acao => {
                        console.log(`[${acao.dataHora.toLocaleTimeString()}] ${acao.origem} -> ${acao.alvo}: ${acao.descricao} (Dano: ${acao.valorDano})`);
                    });
                    break;

                case "5": 
                    salvarJogo(batalha);
                    console.log("Encerrando... Até logo! 👋");
                    fecharInterface();
                    rodando = false; 
                    break;

                case "6":
                    console.log("\n--- 👼 ZONA DE RESSURREIÇÃO (Admin) 👼 ---");
                    console.log("1. Reviver um Personagem Específico");
                    console.log("2. Reviver TODOS (Nova Rodada)");
                    const opReviver = await perguntar("=> Opção: ");

                    if (opReviver === "1") {
                        const mortos = batalha.listarPersonagens().filter(p => !p.estaVivo);
                        if (mortos.length === 0) {
                            console.log("Ninguém está morto!");
                            break;
                        }
                        mortos.forEach(p => console.log(`[ID: ${p.id}] ${p.nome} (Morto)`));
                        
                        const idRev = Number(await perguntar("Digite o ID para reviver: "));
                        const alvo = batalha.listarPersonagens().find(p => p.id === idRev);
                        
                        if (alvo) {
                            (alvo as any)._vida = (alvo as any)._vidaMaxima;
                            console.log(`✨ ${alvo.nome} foi revivido com sucesso!`);
                        } else {
                            console.log("❌ ID não encontrado.");
                        }

                    } else if (opReviver === "2") {
                        batalha.listarPersonagens().forEach(p => {
                            (p as any)._vida = (p as any)._vidaMaxima;
                        });
                        console.log("✨ TODOS FORAM REVIVIDOS! NOVA RODADA INICIADA! ✨");
                    }
                    break;

                case "7":
                    let combatentes = batalha.listarPersonagens().filter(p => p.estaVivo);
                    if (combatentes.length < 2) {
                        console.log("⚠️  Precisa de pelo menos 2 personagens vivos para iniciar o Battle Royale.");
                        break;
                    }

                    console.log("\n===========================================");
                    console.log("🤖 ⚔️  INICIANDO BATTLE ROYALE AUTOMÁTICO  ⚔️ 🤖");
                    console.log("===========================================");

                    while (!batalha.verificarVencedor() && combatentes.length > 1) {
                        
                        combatentes = batalha.listarPersonagens().filter(p => p.estaVivo);
                        
                        if (combatentes.length < 2) break;

                        const indexAtacante = Math.floor(Math.random() * combatentes.length);
                        const atacante = combatentes[indexAtacante];

                        if (!atacante) break; 

                        const possiveisAlvos = combatentes.filter(p => p.id !== atacante.id);
                        if (possiveisAlvos.length === 0) break;

                        const indexAlvo = Math.floor(Math.random() * possiveisAlvos.length);
                        const alvo = possiveisAlvos[indexAlvo];

                        if (!alvo) break;

                        console.log(`\n⏳ ... Sorteando confronto ...`);
                        await sleep(1000);
                        
                        const detAtacante = obterDetalhesClasse(atacante);
                        const detAlvo = obterDetalhesClasse(alvo);

                        console.log(`>>> 🎲 ${atacante.nome} ${detAtacante} decidiu atacar ${alvo.nome} ${detAlvo}!`);
                        
                        batalha.turno(atacante.id, alvo.id);

                        const vivosAgora = batalha.listarPersonagens().filter(p => p.estaVivo).length;
                        console.log(`(Restam ${vivosAgora} lutadores em pé)`);
                    }

                    console.log("\n-----------------------------------------");
                    const campeao = batalha.verificarVencedor();
                    if (campeao) {
                        console.log(`🎉🏆 O GRANDE CAMPEÃO DO BATTLE ROYALE É: ${campeao.nome} !!! 🏆🎉`);
                    } else {
                        const vivosFinal = batalha.listarPersonagens().filter(p => p.estaVivo);
                        if(vivosFinal.length === 0) {
                            console.log(`☠️  A BATALHA TERMINOU EM EMPATE! Todos morreram. ☠️`);
                        } else {
                            console.log(`⏹️  Batalha encerrada.`);
                        }
                    }
                    break;

                default:
                    console.log("❌ Opção inválida.");
            }
            
        } catch (erro: any) {
            console.log(`❌ ERRO: ${erro.message}`);
        }
    }
}

main();