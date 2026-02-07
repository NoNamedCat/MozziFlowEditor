const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    console.log("🔍 Iniciando Auditoría Visual en Navegador...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Redirigir consola del navegador a la terminal
    page.on('console', msg => {
        if (msg.type() === 'error') console.log(`
❌ [BROWSER ERROR]: ${msg.text()}`);
    });

    page.on('pageerror', err => {
        console.log(`
🚨 [FATAL ERROR]: ${err.message}`);
    });

    const indexPaths = [
        'file://' + path.resolve(__dirname, '../index.html'),
        'http://localhost:8080/index.html' // Por si acaso
    ];

    try {
        await page.goto(indexPaths[0], { waitUntil: 'networkidle0' });
        console.log("✅ Editor cargado en el navegador.");

        // 1. Verificar si los nodos están registrados en el objeto global
        const registry = await page.evaluate(() => {
            return NodeLibrary.map(n => n.nodetype);
        });
        
        console.log(`
📦 Nodos registrados en el navegador: ${registry.length}`);
        if (!registry.includes('wave/mozzi_wavepacket')) {
            console.log("⚠️  ERROR CRÍTICO: 'wave/mozzi_wavepacket' NO está en el registro visual.");
        }

        // 2. Intentar cargar ejemplos problemáticos
        const examples = ['wavepacket', 'acid_pro', 'reverb'];
        for (const ex of examples) {
            console.log(`
🧪 Probando carga visual del ejemplo: [${ex}]...`);
            await page.evaluate((name) => {
                window.loadExample(name);
            }, ex);
            await new Promise(r => setTimeout(r, 500)); // Esperar renderizado
        }

    } catch (e) {
        console.error("No se pudo cargar el archivo local. Asegúrate de que la ruta es correcta.");
    }

    await browser.close();
    console.log("\n🏁 Auditoría finalizada.");
})();
