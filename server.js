const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Define o diretório raiz como o diretório atual
    const baseDir = __dirname;
    
    // Remove query strings da URL
    let urlPath = req.url.split('?')[0];
    
    // Se a URL for '/', redireciona para index.html
    if (urlPath === '/') {
        urlPath = '/index.html';
    }
    
    // Constrói o caminho completo do arquivo
    let filePath = path.join(baseDir, urlPath);
    
    // Log para debug
    console.log(`Requisição: ${req.url}`);
    console.log(`Procurando arquivo: ${filePath}`);
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Verifica se o arquivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`Arquivo não encontrado: ${filePath}`);
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>404 - Página não encontrada</title>
                    <style>
                        body {
                            background: #0a0a0a;
                            color: white;
                            font-family: Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                        }
                        .error-container {
                            text-align: center;
                        }
                        h1 {
                            font-size: 4em;
                            color: #ff0000;
                        }
                    </style>
                </head>
                <body>
                    <div class="error-container">
                        <h1>404</h1>
                        <p>Página não encontrada</p>
                        <p>Caminho procurado: ${filePath}</p>
                        <a href="/" style="color: #ff0000;">Voltar para a página inicial</a>
                    </div>
                </body>
                </html>
            `);
            return;
        }
        
        // Lê e serve o arquivo
        fs.readFile(filePath, (error, content) => {
            if (error) {
                console.error(`Erro ao ler arquivo: ${error.code}`);
                res.writeHead(500);
                res.end('Erro no servidor: ' + error.code);
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Diretório base: ${__dirname}`);
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log(`========================================`);
});