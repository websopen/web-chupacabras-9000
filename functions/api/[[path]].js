export async function onRequest(context) {
    const { request, env, params } = context;

    // El path capturado por el comodín [[path]]
    // Si la petición a nuestro worker es /api/v1/erp/health, 
    // params.path será ["v1", "erp", "health"]
    const routePath = params.path ? params.path.join('/') : '';

    // URL base del VPS de OMNIII (Usamos el dominio público para evitar problemas de puerto/firewall)
    const VPS_BASE_URL = env.VPS_API_URL || "https://websopen.com";

    // Construimos la URL de destino manteniendo la estructura /api/...
    const targetUrl = `${VPS_BASE_URL}/api/${routePath}`;

    console.log(`Proxying request to: ${targetUrl}`);

    try {
        // Clonamos la petición original para reenviarla
        const payload = await request.clone().text();

        const response = await fetch(targetUrl, {
            method: request.method,
            headers: {
                ...Object.fromEntries(request.headers),
                'Host': new URL(VPS_BASE_URL).host,
                // Podríamos inyectar Headers de autenticación si el VPS lo requiriera
                // 'Authorization': `Bearer ${env.API_SECRET_TOKEN}`
            },
            body: (request.method !== 'GET' && request.method !== 'HEAD') ? payload : undefined
        });

        // Intentamos obtener el cuerpo de la respuesta
        const contentType = response.headers.get('content-type');
        let responseData;

        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
            return new Response(JSON.stringify(responseData), {
                status: response.status,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        } else {
            responseData = await response.text();
            return new Response(responseData, {
                status: response.status,
                headers: {
                    'Content-Type': contentType || 'text/plain',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

    } catch (err) {
        console.error(`Proxy error: ${err.message}`);
        return new Response(JSON.stringify({
            error: err.message,
            status: "error",
            target: targetUrl
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
