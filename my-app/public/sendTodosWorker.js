import { sendInBatches } from '/sendTodos.js';

/**
 * Shared Web Worker that handles sending todos in batches.
 * Multiple tabs/windows can connect to this worker and request batch sends.
 * Automatically sends batches every 1 minute.
 */

// periodic send every 1 minute
setInterval(async () => {
    try {
        await sendInBatches();
    } catch (err) {
        console.error('periodic batch send failed:', err);
    }
}, 60000);

onconnect = (event) => {
    const port = event.ports[0];

    port.onmessage = async (msg) => {
        if (msg.data.command === 'sendInBatches') {
            try {
                await sendInBatches();
                port.postMessage({ success: true, message: 'Todos sent and cleared from local db' });
            } catch (err) {
                port.postMessage({ success: false, error: err?.message || String(err) });
            }
        }
    };

    port.start();
};
