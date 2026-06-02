import React, { useState } from "react";
import { 
  Project, 
  ProductivityStats, 
  Version 
} from "../types";
import { 
  BarChart2, 
  Clock, 
  Video, 
  Cpu, 
  Award, 
  Layers, 
  Download, 
  History, 
  ShoppingBag, 
  Database, 
  Users, 
  FolderPlus, 
  Check, 
  Trash2,
  Lock,
  RefreshCw
} from "lucide-react";

interface DashboardProps {
  project: Project;
  stats: ProductivityStats;
  onSelectProject: (projId: string) => void;
  onAddNewProject: (name: string) => void;
  onRestoreVersion: (version: Version) => void;
  onClose: () => void;
}

export default function Dashboard({
  project,
  stats,
  onSelectProject,
  onAddNewProject,
  onRestoreVersion,
  onClose
}: DashboardProps) {
  const [newProjName, setNewProjName] = useState("");
  const [licenseKey, setLicenseKey] = useState("VCP-992-AI-883A");
  const [licensed, setLicensed] = useState(true);

  // Store lists
  const [storeMusic] = useState([
    { title: "Sunset Synthwave", author: "VVC Beats", price: "R$ 14,90", downloaded: true },
    { title: "Hyperpop Glitch Core", author: "Z-Audio", price: "R$ 19,90", downloaded: false },
    { title: "Epic Cinematic Orchestral", author: "Kore Tunes", price: "R$ 39,90", downloaded: false },
  ]);

  const [storeTemplates] = useState([
    { name: "Tech Review Vlog Frame", price: "Grátis", installed: true },
    { name: "3D Cubes Dynamic Transition", price: "R$ 8,90", installed: false },
    { name: "Instagram Story Liquid Motion", price: "R$ 12,50", installed: false },
  ]);

  const handleCreatePrj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    onAddNewProject(newProjName);
    setNewProjName("");
  };

  return (
    <div className="min-h-full bg-neutral-900 text-neutral-200 p-6 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-neutral-800 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart2 className="w-8 h-8 text-teal-400" />
            VisionCut Pro <span className="text-xs bg-teal-500/10 text-teal-400 px-2.5 py-1 rounded-full font-mono">v3.5 Commercial</span>
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Estúdio Central de Produtividade, Licenciamento e Assets do Usuário</p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 md:mt-0 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-semibold transition shadow-md shadow-teal-900/20"
        >
          Voltar ao Editor Timeline
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* FIRST COLUMN: KEY STATS */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-neutral-850 p-4 rounded-xl border border-neutral-800 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-teal-500/10 text-teal-400">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-neutral-400 block uppercase font-semibold">Minutos de Edição</span>
                <span className="text-2xl font-bold text-white font-mono">{stats.editingTimeMinutes}m</span>
              </div>
            </div>

            <div className="bg-neutral-850 p-4 rounded-xl border border-neutral-800 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-neutral-400 block uppercase font-semibold">Vídeos Renderizados</span>
                <span className="text-2xl font-bold text-white font-mono">{stats.exportsCount}</span>
              </div>
            </div>

            <div className="bg-neutral-850 p-4 rounded-xl border border-neutral-800 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-pink-500/10 text-pink-400">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-neutral-400 block uppercase font-semibold">Frames Processados</span>
                <span className="text-2xl font-bold text-white font-mono">{stats.renderedFrames.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-neutral-850 p-4 rounded-xl border border-neutral-800 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-neutral-400 block uppercase font-semibold">Operações por IA</span>
                <span className="text-2xl font-bold text-white font-mono">{stats.aiOperationsCount}</span>
              </div>
            </div>

          </div>

          {/* PROJECT SAVING & MANAGEMENT */}
          <div className="bg-neutral-850 p-5 rounded-xl border border-neutral-800">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-400" />
              Banco de Dados de Projetos Locais
            </h3>
            
            <form onSubmit={handleCreatePrj} className="flex gap-2 max-w-lg mb-6">
              <input
                type="text"
                placeholder="Ex Nome: Campanha de Marketing 2026"
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
                className="flex-1 px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-teal-400 font-semibold rounded-lg text-sm transition flex items-center gap-1.5 border border-teal-500/20"
              >
                <FolderPlus className="w-4 h-4" />
                Criar Projeto
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              <div className="p-3 bg-teal-950/20 border border-teal-500/30 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white text-sm">{project.name}</h4>
                  <p className="text-xs text-teal-400/80 mt-0.5">Projeto Ativo Atualmente ({project.tracks.length} tracks, {project.clips.length} clipes no timeline)</p>
                </div>
                <span className="text-xs bg-teal-500 text-neutral-950 font-bold uppercase px-2 py-0.5 rounded">Ativo</span>
              </div>
              
              <div className="p-3 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg flex items-center justify-between opacity-70 transition">
                <div>
                  <h4 className="font-semibold text-neutral-300 text-sm">Vlog Pessoal de Tecnologia #8</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Criado em: 15/05/2026 - Salvo Auto (21 tracks)</p>
                </div>
                <button 
                  onClick={() => onSelectProject("custom-project-vlog")}
                  className="text-xs text-teal-400 hover:underline"
                >
                  Carregar Projeto
                </button>
              </div>

              <div className="p-3 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg flex items-center justify-between opacity-70 transition">
                <div>
                  <h4 className="font-semibold text-neutral-300 text-sm">Cortes TikTok - Podcast Piloto</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Criado em: 12/04/2026 - Salvo Auto (3 tracks)</p>
                </div>
                <button 
                  onClick={() => onSelectProject("custom-project-cuts")}
                  className="text-xs text-teal-400 hover:underline"
                >
                  Carregar Projeto
                </button>
              </div>
            </div>
          </div>

          {/* TEMPLATE STORE & INTEGRATED ASSETS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-neutral-850 p-5 rounded-xl border border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-pink-400" />
                  Loja de Templates Integrada
                </h3>
                <span className="text-xs text-neutral-400">Sincronizado</span>
              </div>

              <div className="space-y-2">
                {storeTemplates.map((item, idx) => (
                  <div key={idx} className="p-3 bg-neutral-900 rounded-lg flex items-center justify-between text-xs border border-neutral-800">
                    <div>
                      <p className="font-medium text-neutral-200">{item.name}</p>
                      <p className="text-neutral-500 mt-0.5">Preço: {item.price}</p>
                    </div>
                    {item.installed ? (
                      <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 font-semibold rounded block">Instalado</span>
                    ) : (
                      <button className="px-3 py-1 bg-pink-600 hover:bg-pink-500 text-white font-semibold rounded transition">Comprar</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-850 p-5 rounded-xl border border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  Biblioteca de Assets da Nuvem
                </h3>
                <span className="text-xs text-neutral-400">Acesso Premium</span>
              </div>

              <div className="space-y-2">
                {storeMusic.map((item, idx) => (
                  <div key={idx} className="p-3 bg-neutral-900 rounded-lg flex items-center justify-between text-xs border border-neutral-800">
                    <div>
                      <p className="font-medium text-neutral-200">{item.title}</p>
                      <p className="text-neutral-500 mt-0.5">Licença: {item.price} - Autor: {item.author}</p>
                    </div>
                    {item.downloaded ? (
                      <span className="px-2 py-0.5 bg-neutral-800 text-teal-400 font-semibold rounded flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Baixado
                      </span>
                    ) : (
                      <button className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded transition flex items-center gap-1">
                        <Download className="w-3 h-3" /> Baixar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* COLLABORATIVE & COMMENTS LOG */}
          <div className="bg-neutral-850 p-5 rounded-xl border border-neutral-800">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Comentários e Colaboração em Tempo Real (Equipe)
            </h3>
            <p className="text-xs text-neutral-400 mb-4">Membros da equipe de produção de conteúdo podem comentar diretamente em pontos específicos da agulha de reprodução:</p>
            
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {project.comments && project.comments.length > 0 ? (
                project.comments.map((c) => (
                  <div key={c.id} className="p-2.5 bg-neutral-900 rounded-lg flex gap-3 text-xs border border-neutral-800">
                    <img src={c.avatar} alt={c.user} className="w-8 h-8 rounded-full border border-neutral-700 object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{c.user}</span>
                        <span className="text-[10px] text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded font-mono">Agulha: {c.time.toFixed(1)}s</span>
                      </div>
                      <p className="text-neutral-300 mt-1">{c.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-500 italic">Sem comentários registrados no momento. Use o painel de exportação ou comentários do editor para adicionar.</p>
              )}
            </div>
          </div>

        </div>

        {/* SIDE BAR / COLUMN 2: LICENSING & VERSIONS */}
        <div className="space-y-6">
          
          {/* Subscription Card */}
          <div className="bg-gradient-to-br from-neutral-850 to-neutral-800 p-5 rounded-xl border border-neutral-800">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-400" />
              Assinatura & Licenciamento
            </h3>
            <p className="text-xs text-neutral-400 mb-4">Verifique a validade de sua chave comercial de uso pessoal ou corporativo.</p>
            
            <div className="p-3.5 bg-neutral-900 rounded-lg border border-neutral-800 mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-neutral-400">Status da Licença:</span>
                <span className="font-bold text-teal-400">Ativa • Comercial</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Validade:</span>
                <span className="font-mono text-white">01/01/2028</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-neutral-400 font-semibold block uppercase">Chave de Assinatura VisionCut</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  className="text-xs font-mono bg-neutral-900 border border-neutral-700 rounded p-1.5 text-white flex-1 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => alert("Licença homologada com sucesso pelo validador local de assinaturas!")}
                  className="text-xs bg-neutral-800 hover:bg-neutral-700 text-teal-400 font-semibold px-2.5 rounded border border-teal-500/10"
                >
                  Validar
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Versioning Control */}
          <div className="bg-neutral-850 p-5 rounded-xl border border-neutral-800">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <History className="w-5 h-5 text-teal-400" />
              Histórico de Versões
            </h3>
            <p className="text-xs text-neutral-400 mb-3">Restaure pontos consolidados de seu trabalho:</p>
            
            <div className="space-y-2">
              {project.versions && project.versions.length > 0 ? (
                project.versions.map((ver) => (
                  <div key={ver.id} className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 text-xs flex flex-col justify-between hover:border-teal-500/40 transition">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-neutral-200">{ver.name}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{new Date(ver.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-neutral-400 text-[11px] h-9 overflow-hidden text-ellipsis mb-2">{ver.description}</p>
                    <button
                      onClick={() => onRestoreVersion(ver)}
                      className="w-full text-center py-1 bg-neutral-800 hover:bg-teal-500 hover:text-neutral-900 text-teal-400 rounded-md font-semibold text-[11px] transition flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Restaurar Esta Versão
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-500 italic">Nenhum snapshot de backup gerado ainda. O salvamento automático se encarrega de criar versões sob demanda!</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
