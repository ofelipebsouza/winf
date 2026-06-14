
import { ICommunicationProvider } from './interfaces';
import { RayLogger } from '../wnoEngine';

export class MockWhatsAppProvider implements ICommunicationProvider {
  private status: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING' = 'CONNECTED';
  private messageHandler: ((msg: { from: string; body: string }) => void) | null = null;

  getStatus() { return this.status; }

  async sendMessage(to: string, content: string): Promise<void> {
    console.log(`[WhatsApp Outgoing to ${to}]: ${content}`);
    // Simulate blocks of messages (Anti-textão)
    const blocks = content.split('\n').filter(b => b.trim().length > 0);
    for (const block of blocks) {
      // In a real scenario, we would send these with a small delay
      this.simulateIncomingToUI(block);
    }
  }

  async getQRCode(): Promise<string> {
    return 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=WINF-CORTEX-MOCK';
  }

  onMessage(callback: (message: { from: string; body: string }) => void) {
    this.messageHandler = callback;
  }

  // Helper method for the Simulator UI
  public simulateIncomingMessage(from: string, body: string) {
    if (this.messageHandler) {
      this.messageHandler({ from, body });
    }
  }

  private simulateIncomingToUI(text: string) {
    RayLogger.logToCortex('system', `Agente (WhatsApp): ${text}`);
  }
}
