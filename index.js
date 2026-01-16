const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const axios = require("axios");
const xml2js = require("xml2js");


const EPG_URL = "https://raw.githubusercontent.com/limaalef/BrazilTVEPG/refs/heads/main/epg.xml";

let epgCache = [];

// 1. Função para buscar o Guia (EPG)
async function updateEPG() {
    try {
        console.log("Baixando guia EPG...");
        const response = await axios.get(EPG_URL, { timeout: 15000 });
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);
        epgCache = result.tv.programme;
        console.log("✅ Guia atualizado!");
    } catch (err) {
        console.error("❌ Erro ao carregar EPG:", err.message);
    }
}

// Atualiza o guia ao iniciar e depois a cada 4 horas
updateEPG();
setInterval(updateEPG, 4 * 60 * 60 * 1000);

// 2. Configuração do Manifesto
const builder = new addonBuilder({
    id: "org.guia.tvmap.br",
    name: "Guia TV Brasil",
    version: "1.0.0",
    description: "Programação atual dos canais brasileiros.",
    resources: ["catalog", "meta"],
    types: ["tv"],
    catalogs: [
        {
            type: "tv",
            id: "guia_br",
            name: "Programação Agora"
        }
    ]
});

// 3. Handler do Catálogo (Lista de Canais)
builder.defineCatalogHandler(async (args) => {
    if (args.id === "guia_br") {
        const agora = new Date();

    const canaisParaMostrar = []

  const listaCanais = [
      // --- TV ABERTA ---
      { xmlId: "Globo", name: "Globo", logo: "https://i.imgur.com/7S879vS.png" },
      { xmlId: "SBT", name: "SBT", logo: "https://i.imgur.com/vHqQ9z4.png" },
      { xmlId: "Record", name: "Record TV", logo: "https://i.imgur.com/uG939z4.png" },
      { xmlId: "Band", name: "Band", logo: "https://i.imgur.com/O6S322P.png" },

      // --- FILMES E SÉRIES ---
      { xmlId: "HBO", name: "HBO", logo: "https://i.imgur.com/mS9X3zG.png" },
      { xmlId: "HBO2", name: "HBO 2", logo: "https://i.imgur.com/mS9X3zG.png" },
      { xmlId: "TelecinePremium", name: "Telecine Premium", logo: "https://i.imgur.com/Z4v0S0X.png" },
      { xmlId: "TelecineAction", name: "Telecine Action", logo: "https://i.imgur.com/Z4v0S0X.png" },
      { xmlId: "TelecinePipoca", name: "Telecine Pipoca", logo: "https://i.imgur.com/Z4v0S0X.png" },
      { xmlId: "Megapix", name: "Megapix", logo: "https://i.imgur.com/6Xw6X7X.png" },
      { xmlId: "TNT", name: "TNT", logo: "https://i.imgur.com/R3U6zY9.png" },
      { xmlId: "Cinemax", name: "Cinemax", logo: "https://i.imgur.com/T0W1W2Y.png" },
      { xmlId: "Warner", name: "Warner Channel", logo: "https://i.imgur.com/2s3D8W9.png" },
      { xmlId: "StudioUniversal", name: "Studio Universal", logo: "https://i.imgur.com/w9U6Y9X.png" },
      { xmlId: "AXN", name: "AXN", logo: "https://i.imgur.com/8N69vT1.png" },
      { xmlId: "UniversalTV", name: "Universal TV", logo: "https://i.imgur.com/5GzLpT7.png" },

      // --- VARIEDADES E DOCUMENTÁRIOS ---
      { xmlId: "Multishow", name: "Multishow", logo: "https://i.imgur.com/G9O6zW3.png" },
      { xmlId: "GNT", name: "GNT", logo: "https://i.imgur.com/H9O6zW3.png" },
      { xmlId: "DiscoveryChannel", name: "Discovery Channel", logo: "https://i.imgur.com/5GzLpT7.png" },
      { xmlId: "DiscoveryHomeHealth", name: "Discovery H&H", logo: "https://i.imgur.com/5GzLpT7.png" },
      { xmlId: "HistoryChannel", name: "History Channel", logo: "https://i.imgur.com/uG939z4.png" },
      { xmlId: "NationalGeographic", name: "Nat Geo", logo: "https://i.imgur.com/O6S322P.png" },

      // --- ESPORTES ---
      { xmlId: "SporTV", name: "SporTV", logo: "https://i.imgur.com/mOnd1H9.png" },
      { xmlId: "SporTV2", name: "SporTV 2", logo: "https://i.imgur.com/mOnd1H9.png" },
      { xmlId: "SporTV3", name: "SporTV 3", logo: "https://i.imgur.com/mOnd1H9.png" },
      { xmlId: "ESPN", name: "ESPN", logo: "https://i.imgur.com/yO8vW9R.png" },
      { xmlId: "ESPN2", name: "ESPN 2", logo: "https://i.imgur.com/yO8vW9R.png" },
      { xmlId: "ESPN4", name: "ESPN 4", logo: "https://i.imgur.com/yO8vW9R.png" },
      { xmlId: "Premiere", name: "Premiere", logo: "https://i.imgur.com/mOnd1H9.png" },
      { xmlId: "Premiere2", name: "Premiere 2", logo: "https://i.imgur.com/mOnd1H9.png" }
  ];

    const metas = canais.map(canal => {
            let programaAtual = "Clique para ver a programação";
            
            // Tenta encontrar o programa no EPG
            if (epgCache.length > 0) {
                const prog = epgCache.find(p => {
                    if (p.$.channel !== canal.id) return false;
                    const start = new Date(p.$.start.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2}).*/, '$1-$2-$3T$4:$5:00'));
                    const stop = new Date(p.$.stop.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2}).*/, '$1-$2-$3T$4:$5:00'));
                    return agora >= start && agora <= stop;
                });
                if (prog) programaAtual = prog.title[0];
            }

            return {
                id: `br_${canal.id.toLowerCase()}`,
                type: "tv",
                name: canal.name,
                poster: canal.logo,
                posterShape: "square",
                description: `Agora: ${programaAtual}`
            };
        });

        return { metas };
    }
    return { metas: [] };
});

// 4. Handler de Metadados (Quando clica no canal)
builder.defineMetaHandler(async (args) => {
    // Retorna os detalhes do canal se necessário
    return { meta: null };
});

// 5. Exportação para Vercel/Render
const addonInterface = builder.getInterface();
module.exports = (req, res) => {
    addonInterface.serveHTTP(req, res);
};

// Rodar localmente (node index.js)
if (require.main === module) {
    serveHTTP(addonInterface, { port: process.env.PORT || 7000 });
}
