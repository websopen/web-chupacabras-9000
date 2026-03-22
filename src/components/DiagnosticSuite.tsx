```
import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Copy, Check, Play, RefreshCcw, ChevronRight, AlertCircle, CheckCircle2, Loader2, Search } from 'lucide-react';

interface TestResult {
    name: string;
    endpoint: string;
    status: 'pending' | 'running' | 'success' | 'error';
    response?: any;
    error?: string;
}

const DiagnosticSuite: React.FC<{ businessId: number }> = ({ businessId }) => {
    const [results, setResults] = useState<TestResult[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [copySuccess, setCopySuccess] = useState<boolean | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const logEndRef = useRef<HTMLDivElement>(null);

    const addLog = (msg: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${ timestamp }] ${ msg } `]);
    };

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const runTests = async () => {
        setIsRunning(true);
        setLogs([]);
        addLog('🚀 Iniciando Suite de Diagnóstico Total OMNIII V3.0...');
        addLog(`📍 Configuración: BusinessID = ${ businessId }, Host = api.websopen.com`);

        const initialTests: TestResult[] = [
            { name: 'Core API Health', endpoint: '/api/health', status: 'pending' },
            { name: 'ERPNext Connectivity', endpoint: '/api/v1/erp/health', status: 'pending' },
            { name: 'WhatsApp Evolution', endpoint: '/api/v1/evolution/list', status: 'pending' },
            { name: 'Telegram Core', endpoint: '/api/v1/bot-factory/telethon-status', status: 'pending' },
            { name: 'Knowledge Stats', endpoint: '/api/v1/knowledge/stats', status: 'pending' },
            { name: 'OMNIII Stock', endpoint: '/api/v1/stock/cards', status: 'pending' },
            { name: 'Clawbot Gestor', endpoint: `/ api / v1 / admin / businesses / ${ businessId }/gestor`, status: 'pending' },
{ name: 'Messaging Baseline', endpoint: '/api/v1/messaging/send', status: 'pending' }
        ];

setResults(initialTests);
const currentResults = [...initialTests];

for (let i = 0; i < currentResults.length; i++) {
    const test = currentResults[i];
    currentResults[i] = { ...test, status: 'running' };
    setResults([...currentResults]);
    addLog(`⚡ Probando: ${test.name}...`);

    try {
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

        if (res.ok && data.success !== false) {
            currentResults[i] = { ...test, status: 'success', response: data };
            addLog(`  ✅ EXITO: ${test.name}`);
        } else {
            const errMsg = data.error || data.message || `HTTP ${res.status}`;
            currentResults[i] = { ...test, status: 'error', error: errMsg };
            addLog(`  ❌ FALLO: ${test.name} -> ${errMsg}`);
        }
    } catch (err: any) {
        currentResults[i] = { ...test, status: 'error', error: err.message };
        addLog(`  ⚠️ ERROR CRITICO: ${test.name} -> ${err.message}`);
    }
    setResults([...currentResults]);
}

addLog('🏁 Suite de pruebas finalizada.');
setIsRunning(false);
    };

const copyLogs = () => {
    const text = logs.join('\n');
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(null), 2000);
};

return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
        {/* Header / Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 bg-white/5 border-white/10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Terminal className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                    <h2 className="text-lg font-bold italic tracking-tighter uppercase">Consola de Diagnóstico</h2>
                    <p className="text-xs text-apple-textMuted">Prueba 8+ capas de la arquitectura OMNIII</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={copyLogs}
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
