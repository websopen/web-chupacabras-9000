export async function onRequest(context) {
    const { request, env, params } = context;

    // El path capturado por el comodín [[route]]
    // Si la petición a nuestro worker es /api/messaging/send, 
    // params.route será ["send"]
    const routePath = params.route ? params.route.join('/') : '';

    // URL base del VPS
    // Obtenemos de secretos (en producción) o usamos la IP en el de desarrollo configurado
    const VPS_BASE_URL = env.VPS_API_URL || "http://207.180.243.41:8080";
    const targetUrl = `${VPS_BASE_URL}/api/v1/messaging/${routePath}`;

    try {
        // Clonamos la petición original para reenviarla
        const payload = await request.clone().text();

        const response = await fetch(targetUrl, {
            method: request.method,
            headers: {
                'Content-Type': 'application/json',
                // Aquí podríamos inyectar Headers de autenticación si el VPS lo requiriera
                // 'Authorization': `Bearer ${env.API_SECRET_TOKEN}`
            },
            body: request.method !== 'GET' ? payload : undefined
        });

        const data = await response.json();

        // Retornamos la respuesta al cliente con CORS habilitado si fuera necesario
        // (En CF Pages suele no ser necesario si es el mismo dominio, pero buena práctica)
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message, status: "error" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
