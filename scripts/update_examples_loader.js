const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const examplesDir = path.join(__dirname, '../js/examples');

const exampleFiles = fs.readdirSync(examplesDir).filter(f => f.endsWith('.js'));

let scriptTags = `        <!-- Examples Registry and Individual Patches -->\n`;
exampleFiles.forEach(file => {
    scriptTags += `        <script src="js/examples/${file}"></script>\n`;
});

let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

const startMarker = '<!-- Examples Registry and Individual Patches -->';
const endMarker = '<!-- Mozzi Node Modules -->';

const startIndex = htmlContent.indexOf(startMarker);
const endIndex = htmlContent.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    htmlContent = htmlContent.substring(0, startIndex) + scriptTags + htmlContent.substring(endIndex);
}

var lines = [];
lines.push("            var showExamples = function() {");
lines.push("                if (modalOpen === 1) return;");
lines.push("                modalOpen = 1;");
lines.push("                ");
lines.push("                var keys = Object.keys(EXAMPLES).sort();");
lines.push("                var btnHtml = '<div class=\"ex-container\">';");
lines.push("                ");
lines.push("                var getTitle = function(key) {");
lines.push("                    var code = EXAMPLES[key];");
lines.push("                    var match = code.match(new RegExp('network/add-patch \\S+ (.+)'));");
lines.push("                    if (match) return match[1].replace(/_/g, ' ');");
lines.push("                    return key;");
lines.push("                };");
lines.push("");
lines.push("                keys.forEach(function(key) {");
lines.push("                    btnHtml += `<button class=\"ex-btn\" onclick=\"loadExample('\${key}')\">\${getTitle(key)}</button>`;");
lines.push("                });");
lines.push("                btnHtml += '</div>';");
lines.push("");
lines.push("                vex.dialog.open({");
lines.push("                    message: 'Select an Example Patch (' + keys.length + ' available)',");
lines.push("                    showCloseButton: true,");
lines.push("                    buttons: [],");
lines.push("                    input: [");
lines.push("                        '<style>',");
lines.push("                            '.ex-container { max-height: 400px; overflow-y: auto; padding-right: 5px; }',");
lines.push("                            '.ex-btn { display: block; width: 100%; margin: 8px 0; padding: 10px; background: #222; border: 1px solid #444; color: #0f9; cursor: pointer; font-family: monospace; text-align: left; font-size: 11px; }',");
lines.push("                            '.ex-btn:hover { background: #333; border-color: #0f9; }',");
lines.push("                        '</style>',");
lines.push("                        btnHtml");
lines.push("                    ].join(''),");
lines.push("                    beforeClose: function() { modalOpen = 0; }");
lines.push("                });");
lines.push("            };");

var funcBody = lines.join("\n");

const funcStart = htmlContent.indexOf('var showExamples = function() {');
const funcNext = htmlContent.indexOf('window.loadExample = function(key) {');

if (funcStart !== -1 && funcNext !== -1) {
    htmlContent = htmlContent.substring(0, funcStart) + funcBody + "\n            " + htmlContent.substring(funcNext);
}

fs.writeFileSync(indexHtmlPath, htmlContent);
console.log("Updated index.html with " + exampleFiles.length + " examples and dynamic loader.");