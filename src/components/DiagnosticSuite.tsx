import { useState } from 'react';
import { Play, Loader2, CheckCircle2, XCircle, Terminal as TerminalIcon, Clipboard } from 'lucide-react';

interface TestResult {
    name: string;
    endpoint: string;
    status: 'pending' | 'running' | 'success' | 'error';
    response?: any;
    error?: string;
}

const DiagnosticSuite = ({ businessId }: { businessId: number }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<TestResult[]>([]);
    const [logs, setLogs] = useState<string>('');

    const addLog = (msg: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => prev + `[${timestamp}] ${msg}\n`);
    };

    const runTests = async () => {
        setIsRunning(true);
        setLogs('');
        addLog(`=== Iniciando Diagnóstico Total (Tarjeta ${businessId}) ===`);

        const initialTests: TestResult[] = [
            { name: 'Core API Health', endpoint: '/api/health', status: 'pending' },
            { name: 'ERPNext Connectivity', endpoint: '/api/v1/erp/health', status: 'pending' },
            { name: 'WhatsApp Evolution', endpoint: '/api/v1/evolution/list', status: 'pending' },
            { name: 'Telegram Core', endpoint: '/api/v1/bot-factory/telethon-status', status: 'pending' },
            { name: 'Knowledge Stats', endpoint: '/api/v1/knowledge/stats', status: 'pending' },
            { name: 'OMNIII Stock', endpoint: '/api/v1/stock/cards', status: 'pending' },
            { name: 'Clawbot Gestor', endpoint: `/api/v1/admin/businesses/${businessId}/gestor`, status: 'pending' },
            { name: 'Messaging Baseline', endpoint: '/api/v1/messaging/send', status: 'pending' }
        ];

        setResults(initialTests);

        const currentResults = [...initialTests];

        for (let i = 0; i < currentResults.length; i++) {
            const test = currentResults[i];
            currentResults[i] = { ...test, status: 'running' };
            setResults([...currentResults]);
            addLog(`Ejecutando: ${test.name}...`);

            try {
                // Determine method based on endpoint or name
                const isPost = ['Messaging Baseline'].includes(test.name);
                const method = isPost ? 'POST' : 'GET';

                const body = method === 'POST' ? JSON.stringify({
                    business_id: businessId,
                    target_role: 'cliente',
                    chat_id: 7616797355,
                    text: 'OMNIII Lab V3.0 Diagnostic Ping'
                }) : undefined;

                const res = await fetch(test.endpoint, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body
                });

                const data = await res.json();

                if (res.ok \u0026\u0026 data.success !== false) { // Handle both HTTP 200 and success: false in body
                    currentResults[i] = { ...test, status: 'success', response: data };
                    addLog(`✅ OK: ${test.name}`);
                } else {
                    const errMsg = data.error || data.message || `HTTP ${res.status}`;
                    currentResults[i] = { ...test, status: 'error', error: errMsg };
                    addLog(`❌ FALLO: ${test.name} - ${errMsg}`);
                }
            } catch (err: any) {
                currentResults[i] = { ...test, status: 'error', error: err.message };
                addLog(`⚠️ ERROR: ${test.name} - ${err.message}`);
            }

            setResults([...currentResults]);
        }

        setIsRunning(false);
        addLog(`=== Diagnóstico Completado ===`);
    };

    const copyLogs = () => {
        navigator.clipboard.writeText(logs);
        alert('Logs copiados al portapapeles');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                <div>
                    <h3 className="text-lg font-bold">Diagnóstico de Conectividad</h3>
                    <p className="text-sm text-apple-textMuted text-balance max-w-md">Eecuta una prueba rápida de todos los puentes hacia el VPS (No masivo).</p>
                </div>
                <button
                    onClick={runTests}
                    disabled={isRunning}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all active:scale-95"
                >
                    {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                    {isRunning ? 'Testeando...' : 'Ejecutar Test Total'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {results.map((res, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${res.status === 'success' ? 'bg-green-500/10 border-green-500/30' :
                        res.status === 'error' ? 'bg-red-500/10 border-red-500/30' :
                            res.status === 'running' ? 'bg-blue-500/10 border-blue-500/30 animate-pulse' :
                                'bg-white/5 border-white/10'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-apple-textMuted">{res.name}</span>
                            {res.status === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                            {res.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                            {res.status === 'running' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                        </div>
                        <div className="text-xs font-mono truncate text-apple-textMuted opacity-50 mb-2">{res.endpoint}</div>
                        {res.error && <div className="text-[10px] text-red-400 leading-tight">Error: {res.error}</div>}
                    </div>
                ))}
            </div>

            <div className="glass-panel p-0 overflow-hidden border border-white/10 shadow-2xl">
                <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-apple-textMuted">
                        <TerminalIcon className="w-3 h-3" />
                        SYSTEM_LOGS.txt
                    </div>
                    <button
                        onClick={copyLogs}
                        className="text-apple-textMuted hover:text-white transition-colors"
                        title="Copiar logs"
                    >
                        <Clipboard className="w-4 h-4" />
                    </button>
                </div>
                <textarea
                    readOnly
                    value={logs || 'Esperando inicio de pruebas...'}
                    className="w-full h-48 bg-black/80 p-4 text-xs font-mono text-blue-300 focus:outline-none resize-none"
                    placeholder="Results will appear here..."
                />
            </div>
        </div>
    );
};

export default DiagnosticSuite;
