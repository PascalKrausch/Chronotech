'use client';

type Props = {
  code: string;
};

export default function JsSimulation({ code }: Props) {
  const iframeSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #111; color: #fff; font-family: sans-serif; }
          canvas { border: 1px solid #333; background: #000; box-shadow: 0 4px 6px rgba(0,0,0,0.3); max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        <canvas id="simCanvas" width="500" height="400"></canvas>
        <script>
          try {
            ${code}
          } catch(err) {
            document.body.innerHTML = "<p style='color:#ef4444; padding:20px; font-family:sans-serif;'>Fehler im Code: " + err.message + "</p>";
          }
        </script>
      </body>
    </html>
  `;

  return (
    <iframe
      srcDoc={iframeSrcDoc}
      className="w-full h-[500px] bg-[#111]"
      sandbox="allow-scripts"
      title="JavaScript Live Simulation"
    />
  );
}

