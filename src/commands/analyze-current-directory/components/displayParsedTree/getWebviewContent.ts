export const getWebviewContent = (data: any) => {
  return `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Visualyser</title>
            <script src="https://cdn.jsdelivr.net/npm/json-formatter-js@2.3.4/dist/json-formatter.umd.min.js"></script>
            <link href="https://cdn.jsdelivr.net/npm/json-formatter-js@2.3.4/dist/json-formatter.min.css" rel="stylesheet">
        </head>
        <body style="background-color: white;">
            <div id="jsonDisplay" style="min-height: 100dvh; min-width: 100dvw; height: auto; width: auto;"></div>
            <script>
                const formatter = new JSONFormatter(${JSON.stringify(data)});
                document.getElementById("jsonDisplay").appendChild(formatter.render());
            </script>
        </body>
        </html>
    `;
};
