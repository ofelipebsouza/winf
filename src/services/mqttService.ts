import mqtt, { MqttClient, IClientOptions } from 'mqtt';

class MqttService {
  private client: MqttClient | null = null;
  private isConnecting = false;

  public connect(brokerUrl: string, options: IClientOptions): MqttClient {
    if (this.client && this.client.connected) {
      return this.client;
    }

    if (!this.client && !this.isConnecting) {
      this.isConnecting = true;

      // Ensure we use WSS (WebSocket Secure) in browser
      this.client = mqtt.connect(brokerUrl, {
        ...options,
        reconnectPeriod: 5000,
        connectTimeout: 30 * 1000,
        keepalive: 60,
        protocolId: 'MQTT',
        protocolVersion: 4,
        clean: true,
      });

      this.client.on('connect', () => {
        console.log('[MQTT] Connected to broker');
        this.isConnecting = false;
      });

      this.client.on('reconnect', () => {
        console.log('[MQTT] Reconnecting...');
      });

      this.client.on('offline', () => {
        console.warn('[MQTT] Offline');
      });

      this.client.on('error', (err) => {
        console.error('[MQTT] Error:', err);
        this.client?.end();
        this.isConnecting = false;
      });
    }

    return this.client!;
  }

  public disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
    this.isConnecting = false;
  }

  public getClient(): MqttClient | null {
    return this.client;
  }

  public publish(topic: string, message: any, options: mqtt.IClientPublishOptions = { qos: 0 }) {
    if (this.client && this.client.connected) {
      this.client.publish(topic, typeof message === 'string' ? message : JSON.stringify(message), options);
    } else {
      console.error('[MQTT] Cannot publish, client not connected.');
    }
  }

  // --- Implementações de QoS e Retain ---

  /**
   * Telemetria (QoS 0): Envio rápido e frequente (fire-and-forget). Sem overhead de confirmação.
   */
  public publishTelemetry(deviceId: string, telemetry: any) {
    this.publish(`winf/devices/${deviceId}/telemetry`, telemetry, { qos: 0, retain: false });
  }

  /**
   * Comandos (QoS 1): Entrega garantida (pelo menos uma vez). Usado para controle (ex: mudar opacidade).
   */
  public publishCommand(deviceId: string, commandType: string, payload: any) {
    this.publish(`winf/devices/${deviceId}/command/${commandType}`, payload, { qos: 1, retain: false });
  }

  /**
   * Status e Configurações (QoS 1 + Retain): Último estado conhecido. 
   * Dispositivos ao se conectarem receberão a última mensagem imediatamente.
   */
  public publishStatus(deviceId: string, status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE') {
    this.publish(`winf/devices/${deviceId}/status`, { status, timestamp: new Date().toISOString() }, { qos: 1, retain: true });
  }

  public publishConfig(deviceId: string, config: any) {
    this.publish(`winf/devices/${deviceId}/config`, config, { qos: 1, retain: true });
  }

  /**
   * Alertas Críticos (QoS 1 ou 2): A entrega não pode falhar.
   */
  public publishAlert(deviceId: string, alertType: string, payload: any) {
    this.publish(`winf/devices/${deviceId}/alerts/${alertType}`, payload, { qos: 1, retain: false });
  }

  /**
   * Limpar Mensagem Retida: Publica um payload vazio (buffer de 0 bytes) no tópico retido.
   */
  public clearRetained(topic: string) {
    if (this.client && this.client.connected) {
      this.client.publish(topic, '', { qos: 1, retain: true }); // Enviar string vazia remove a msg do broker
    }
  }

  public subscribe(topic: string | string[], options: mqtt.IClientSubscribeOptions = { qos: 0 }) {
    if (this.client && this.client.connected) {
      this.client.subscribe(topic, options);
    }
  }
}

export const mqttService = new MqttService();
