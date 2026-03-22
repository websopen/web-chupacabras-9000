import { useState } from 'react';
import ApiTester from './components/ApiTester';
import {
    Settings, Send, Users, Truck, ShoppingBag, PackageCheck,
    Database, Brain, Terminal, LayoutGrid, Activity,
    ShieldCheck, Cpu, MessageSquare
} from 'lucide-react';

function App() {
    const [businessId, setBusinessId] = useState<number>(33);
    const [activeTab, setActiveTab] = useState<string>('messaging');
    const [targetRole, setTargetRole] = useState<string>('cliente');
    const [defaultChatId, setDefaultChatId] = useState<string>('');

    const TabButton = ({ id, icon: Icon, label, color }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === id
                    ? `bg-${color}-500/20 text-${color}-400 border border-${color}-500/50 shadow-[0_0_15px_rgba(0,0,0,0.2)]`
                    : 'text-apple-textMuted hover:text-white hover:bg-white/5 border border-transparent'
                }`}
        >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-apple-blue to-purple-500 bg-clip-text text-transparent">
                    OMNIII Full System Lab
                </h1>
                <p className="text-apple-textMuted mt-2">Consola de depuración y pruebas para el ecosistema Chupacabras-9000</p>
            </header>

            {/* Global Configuration */}
            <section className="glass-panel p-6 mb-8 border-l-4 border-l-apple-blue">
                <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-apple-blue" />
                    <h2 className="text-xl font-semibold">Configuración de la Tarjeta</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-apple-textMuted uppercase mb-2">Business ID (Tarjeta)</label>
                        <input
                            type="number"
                            value={businessId}
                            onChange={e => setBusinessId(parseInt(e.target.value))}
                            className="w-full bg-black/50 border border-apple-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-apple-blue transition-colors"
                            placeholder="Ej. 33"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-apple-textMuted uppercase mb-2">Target Role (Global)</label>
                        <select
                            value={targetRole}
                            onChange={e => setTargetRole(e.target.value)}
                            className="w-full bg-black/50 border border-apple-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-apple-blue transition-colors appearance-none"
                        >
                            <option value="cliente">Cliente</option>
                            <option value="repartidor">Repartidor</option>
                            <option value="empleado">Empleado</option>
                            <option value="dueno">Dueño</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-apple-textMuted uppercase mb-2">Default Chat ID / Teléfono</label>
                        <input
                            type="text"
                            value={defaultChatId}
                            onChange={e => setDefaultChatId(e.target.value)}
                            className="w-full bg-black/50 border border-apple-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-apple-blue transition-colors"
                            placeholder="ID de Telegram o WhatsApp"
                        />
                    </div>
                </div>
            </section>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 bg-white/5 p-2 rounded-xl backdrop-blur-md border border-white/10">
                <TabButton id="messaging" icon={MessageSquare} label="Mensajería" color="blue" />
                <TabButton id="erp" icon={Database} label="ERPNext" color="green" />
                <TabButton id="clawbot" icon={Brain} label="Clawbot" color="purple" />
                <TabButton id="system" icon={Terminal} label="Sistema Core" color="orange" />
            </div>

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'messaging' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <section className="glass-panel p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Send className="w-5 h-5 text-green-500" />
                                    <h2 className="text-xl font-semibold">Mensaje Genérico</h2>
                                </div>
                                <ApiTester
                                    endpoint="/api/v1/messaging/send"
                                    method="POST"
                                    defaultPayload={{
                                        business_id: businessId,
                                        target_role: targetRole,
                                        chat_id: defaultChatId,
                                        text: "Prueba desde OMNIII Lab."
                                    }}
                                    syncGlobal={{ business_id: businessId, target_role: targetRole, chat_id: defaultChatId }}
                                />
                            </section>

                            <section className="glass-panel p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Users className="w-5 h-5 text-yellow-500" />
                                    <h2 className="text-xl font-semibold">Envío Masivo (Bulk)</h2>
                                </div>
                                <ApiTester
                                    endpoint="/api/v1/messaging/send-bulk"
                                    method="POST"
                                    defaultPayload={{
                                        business_id: businessId,
                                        target_role: targetRole,
                                        chat_ids: defaultChatId ? [defaultChatId] : [],
                                        text: "⚠️ Broadcast masivo!"
                                    }}
                                    syncGlobal={{ business_id: businessId, target_role: targetRole }}
                                />
                            </section>
                        </div>

                        <h2 className="text-xl font-bold flex items-center gap-2 mt-8 mb-4">
                            <Activity className="w-5 h-5" /> Flujos de Negocio
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <section className="glass-panel p-5">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-indigo-400" /> Ruta
                                </h3>
                                <ApiTester
                                    endpoint="/api/v1/messaging/flow/repartidor/asignar-ruta"
                                    method="POST"
                                    defaultPayload={{ business_id: businessId, repartidor_chat_id: defaultChatId, repartidor_nombre: "Goku", cantidad_pedidos: 3 }}
                                    syncGlobal={{ business_id: businessId, repartidor_chat_id: defaultChatId }}
                                />
                            </section>
                            <section className="glass-panel p-5">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-orange-400" /> Camino
                                </h3>
                                <ApiTester
                                    endpoint="/api/v1/messaging/flow/cliente/pedido-en-camino"
                                    method="POST"
                                    defaultPayload={{ business_id: businessId, cliente_chat_id: defaultChatId, id_pedido: "ORD-123" }}
                                    syncGlobal={{ business_id: businessId, cliente_chat_id: defaultChatId }}
                                />
                            </section>
                            <section className="glass-panel p-5">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <PackageCheck className="w-5 h-5 text-teal-400" /> Listo
                                </h3>
                                <ApiTester
                                    endpoint="/api/v1/messaging/flow/cliente/pedido-listo"
                                    method="POST"
                                    defaultPayload={{ business_id: businessId, cliente_chat_id: defaultChatId, id_pedido: "ORD-123", tipo_entrega: "retiro" }}
                                    syncGlobal={{ business_id: businessId, cliente_chat_id: defaultChatId }}
                                />
                            </section>
                        </div>
                    </>
                )}

                {activeTab === 'erp' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section className="glass-panel p-6 border-t-2 border-t-green-500">
                            <div className="flex items-center gap-2 mb-4">
                                <Activity className="w-5 h-5 text-green-500" />
                                <h2 className="text-xl font-semibold">ERP Status & Health</h2>
                            </div>
                            <ApiTester
                                endpoint="/api/v1/erp/health"
                                method="GET"
                                defaultPayload={{}}
                            />
                        </section>

                        <section className="glass-panel p-6 border-t-2 border-t-green-500">
                            <div className="flex items-center gap-2 mb-4">
                                <Users className="w-5 h-5 text-blue-400" />
                                <h2 className="text-xl font-semibold">Clientes (Customers)</h2>
                            </div>
                            <ApiTester
                                endpoint="/api/v1/erp/customers"
                                method="GET"
                                defaultPayload={{ limit: 10 }}
                            />
                        </section>

                        <section className="glass-panel p-6 border-t-2 border-t-green-500">
                            <div className="flex items-center gap-2 mb-4">
                                <Database className="w-5 h-5 text-yellow-400" />
                                <h2 className="text-xl font-semibold">Facturas (Invoices)</h2>
                            </div>
                            <ApiTester
                                endpoint="/api/v1/erp/invoices"
                                method="GET"
                                defaultPayload={{ limit: 5 }}
                            />
                        </section>

                        <section className="glass-panel p-6 border-t-2 border-t-green-500">
                            <div className="flex items-center gap-2 mb-4">
                                <ShoppingBag className="w-5 h-5 text-fuchsia-400" />
                                <h2 className="text-xl font-semibold">Empresas & Config</h2>
                            </div>
                            <ApiTester
                                endpoint="/api/v1/erp/companies"
                                method="GET"
                                defaultPayload={{}}
                            />
                        </section>
                    </div>
                )}

                {activeTab === 'clawbot' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section className="glass-panel p-6 border-t-2 border-t-purple-500">
                            <div className="flex items-center gap-2 mb-4">
                                <Brain className="w-5 h-5 text-purple-400" />
                                <h2 className="text-xl font-semibold">Gestor Asignado</h2>
                            </div>
                            <ApiTester
                                endpoint={`/api/v1/admin/businesses/${businessId}/gestor`}
                                method="GET"
                                defaultPayload={{}}
                                syncGlobal={{ business_id: businessId }}
                            />
                        </section>

                        <section className="glass-panel p-6 border-t-2 border-t-purple-500">
                            <div className="flex items-center gap-2 mb-4">
                                <LayoutGrid className="w-5 h-5 text-blue-400" />
                                <h2 className="text-xl font-semibold">Memoria (Profile Tags)</h2>
                            </div>
                            <div className="mb-4 text-xs text-apple-textMuted bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                                <Activity className="w-3 h-3 inline mr-1" />
                                Usa el Gestor ID obtenido de la pestaña anterior para ver la memoria de usuarios.
                            </div>
                            <ApiTester
                                endpoint="/api/v1/admin/gestors/CAMBIAR_POR_ID/tags"
                                method="GET"
                                defaultPayload={{}}
                            />
                        </section>
                    </div>
                )}

                {activeTab === 'system' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section className="glass-panel p-6 border-t-2 border-t-orange-500">
                            <div className="flex items-center gap-2 mb-4">
                                <Activity className="w-5 h-5 text-orange-400" />
                                <h2 className="text-xl font-semibold">Salud del Core</h2>
                            </div>
                            <ApiTester
                                endpoint="/api/health"
                                method="GET"
                                defaultPayload={{}}
                            />
                        </section>

                        <section className="glass-panel p-6 border-t-2 border-t-orange-500">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-5 h-5 text-green-400" />
                                <h2 className="text-xl font-semibold">Reportes de Test (Chaos)</h2>
                            </div>
                            <ApiTester
                                endpoint="/api/internal/tests/reports"
                                method="GET"
                                defaultPayload={{}}
                            />
                        </section>

                        <section className="glass-panel p-6 border-t-2 border-t-orange-500">
                            <div className="flex items-center gap-2 mb-4">
                                <Cpu className="w-5 h-5 text-red-400" />
                                <h2 className="text-xl font-semibold">Inyección Directa Cerebro</h2>
                            </div>
                            <ApiTester
                                endpoint="/api/internal/send_message"
                                method="POST"
                                defaultPayload={{
                                    platform: "telegram",
                                    recipient: defaultChatId,
                                    message: "🚀 Mensaje inyectado directamente a Cerebro actions via Web Lab."
                                }}
                                syncGlobal={{ recipient: defaultChatId }}
                            />
                        </section>
                    </div>
                )}
            </div>

            <footer className="mt-20 py-8 border-t border-apple-border text-center">
                <p className="text-sm text-apple-textMuted font-medium">
                    OMNIII Full System Lab • Business ID: {businessId} • V2.0 (Generic Proxy)
                </p>
                <div className="flex justify-center gap-4 mt-4 opacity-50">
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-tighter">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Vite
                    </div>
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-tighter">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        Tailwind
                    </div>
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-tighter">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        Cloudflare
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
