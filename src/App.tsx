import { useState } from 'react';
import ApiTester from './components/ApiTester';
import { Settings, Send, Users, Truck, ShoppingBag, PackageCheck } from 'lucide-react';

function App() {
    const [businessId, setBusinessId] = useState<number>(25);
    const [targetRole, setTargetRole] = useState<string>('cliente');
    const [defaultChatId, setDefaultChatId] = useState<string>('');

    return (
        <div className="min-h-screen p-6 md:p-12">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-apple-blue to-purple-500 bg-clip-text text-transparent">
                    OMNIII Messaging Lab
                </h1>
                <p className="text-apple-textMuted mt-2">Herramienta interna para pruebas y simulación de flujos de Telegram</p>
            </header>

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Global Configuration */}
                <section className="glass-panel p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Settings className="w-5 h-5 text-apple-blue" />
                        <h2 className="text-xl font-semibold">Configuración Global</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-apple-textMuted mb-1">Business ID</label>
                            <input
                                type="number"
                                value={businessId}
                                onChange={e => setBusinessId(parseInt(e.target.value))}
                                className="w-full bg-black/50 border border-apple-border rounded-lg px-4 py-2 focus:outline-none focus:border-apple-blue transition-colors"
                                placeholder="Ej. 25"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-apple-textMuted mb-1">Target Role (Remitente)</label>
                            <select
                                value={targetRole}
                                onChange={e => setTargetRole(e.target.value)}
                                className="w-full bg-black/50 border border-apple-border rounded-lg px-4 py-2 focus:outline-none focus:border-apple-blue transition-colors appearance-none"
                            >
                                <option value="cliente">Cliente</option>
                                <option value="repartidor">Repartidor</option>
                                <option value="empleado">Empleado</option>
                                <option value="dueno">Dueño</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-apple-textMuted mb-1">Default Destinatorio (Chat ID)</label>
                            <input
                                type="text"
                                value={defaultChatId}
                                onChange={e => setDefaultChatId(e.target.value)}
                                className="w-full bg-black/50 border border-apple-border rounded-lg px-4 py-2 focus:outline-none focus:border-apple-blue transition-colors"
                                placeholder="ID de Telegram"
                            />
                        </div>
                    </div>
                </section>

                {/* Generic Endpoints */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section className="glass-panel p-6 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <Send className="w-5 h-5 text-green-500" />
                            <h2 className="text-xl font-semibold">Mensaje Genérico Libre</h2>
                        </div>
                        <p className="text-sm text-apple-textMuted mb-4">Usa el endpoint base `/api/v1/messaging/send`. Ideal para notificaciones custom.</p>
                        <ApiTester
                            endpoint="/api/messaging/send"
                            method="POST"
                            defaultPayload={{
                                business_id: businessId,
                                target_role: targetRole,
                                chat_id: defaultChatId,
                                text: "Hola, este es un mensaje de prueba libre desde el OMNIII Lab."
                            }}
                            syncGlobal={{ business_id: businessId, target_role: targetRole, chat_id: defaultChatId }}
                        />
                    </section>

                    <section className="glass-panel p-6 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-xl font-semibold">Envío Masivo (Bulk)</h2>
                        </div>
                        <p className="text-sm text-apple-textMuted mb-4">Usa `/api/v1/messaging/send-bulk` para broadcasting a múltiples IDs (separados por coma).</p>
                        <ApiTester
                            endpoint="/api/messaging/send-bulk"
                            method="POST"
                            defaultPayload={{
                                business_id: businessId,
                                target_role: targetRole,
                                chat_ids: defaultChatId ? [defaultChatId] : [],
                                text: "⚠️ Mensaje de prueba masivo!"
                            }}
                            syncGlobal={{ business_id: businessId, target_role: targetRole }}
                        />
                    </section>
                </div>

                {/* Business Flows */}
                <h2 className="text-2xl font-bold mt-12 mb-6">Flujos Prefijados de Negocio</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <section className="glass-panel p-5 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                            <Truck className="w-5 h-5 text-indigo-400" />
                            <h3 className="text-lg font-semibold">Asignar Ruta</h3>
                        </div>
                        <p className="text-xs text-apple-textMuted mb-4 flex-grow">Avisa al repartidor que tiene pedidos nuevos para llevar.</p>
                        <ApiTester
                            endpoint="/api/messaging/flow/repartidor/asignar-ruta"
                            method="POST"
                            defaultPayload={{
                                business_id: businessId,
                                repartidor_chat_id: defaultChatId,
                                repartidor_nombre: "Goku",
                                cantidad_pedidos: 3
                            }}
                            syncGlobal={{ business_id: businessId, repartidor_chat_id: defaultChatId }}
                        />
                    </section>

                    <section className="glass-panel p-5 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                            <ShoppingBag className="w-5 h-5 text-orange-400" />
                            <h3 className="text-lg font-semibold">Envío en Camino</h3>
                        </div>
                        <p className="text-xs text-apple-textMuted mb-4 flex-grow">Avisa al cliente que su pedido ya salió hacia el domicilio.</p>
                        <ApiTester
                            endpoint="/api/messaging/flow/cliente/pedido-en-camino"
                            method="POST"
                            defaultPayload={{
                                business_id: businessId,
                                cliente_chat_id: defaultChatId,
                                id_pedido: "ORD-999",
                                nombre_repartidor: "Goku"
                            }}
                            syncGlobal={{ business_id: businessId, cliente_chat_id: defaultChatId }}
                        />
                    </section>

                    <section className="glass-panel p-5 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                            <PackageCheck className="w-5 h-5 text-teal-400" />
                            <h3 className="text-lg font-semibold">Pedido Listo</h3>
                        </div>
                        <p className="text-xs text-apple-textMuted mb-4 flex-grow">Avisa que el pedido se armó y está para retiro/despacho.</p>
                        <ApiTester
                            endpoint="/api/messaging/flow/cliente/pedido-listo"
                            method="POST"
                            defaultPayload={{
                                business_id: businessId,
                                cliente_chat_id: defaultChatId,
                                id_pedido: "ORD-999",
                                tipo_entrega: "retiro"
                            }}
                            syncGlobal={{ business_id: businessId, cliente_chat_id: defaultChatId }}
                        />
                    </section>

                    <section className="glass-panel p-5 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                            <Users className="w-5 h-5 text-fuchsia-400" />
                            <h3 className="text-lg font-semibold">Broadcasting a Roles</h3>
                        </div>
                        <p className="text-xs text-apple-textMuted mb-4 flex-grow">Envía mensajes a todos los usuarios que reclamaron un rol específico del negocio, saltando sin crashear si no hay ninguno.</p>

                        <div className="space-y-4">
                            <ApiTester
                                endpoint="/api/messaging/send-to-role"
                                method="POST"
                                defaultPayload={{
                                    business_id: businessId,
                                    target_role: "empleado",
                                    text: "⚠️ Atención a todos los empleados: Tienen un nuevo turno asignado."
                                }}
                                syncGlobal={{ business_id: businessId }}
                            />

                            <ApiTester
                                endpoint="/api/messaging/send-to-role"
                                method="POST"
                                defaultPayload={{
                                    business_id: businessId,
                                    target_role: "repartidor",
                                    text: "🚚 Atención a todos los repartidores: Tienen envíos pendientes."
                                }}
                                syncGlobal={{ business_id: businessId }}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default App;
