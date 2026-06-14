import { useEffect, useState } from 'react';
import { mqttService } from '../services/mqttService';
import { useMqttStore } from '../store/useMqttStore';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const BROKER_URL = import.meta.env.VITE_MQTT_BROKER_URL || 'wss://broker.emqx.io:8084/mqtt';

export const useMqtt = () => {
  const { setConnectionStatus, updateDeviceTelemetry, updateDeviceStatus } = useMqttStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          
          // Na prática, use options com username JWT:
          // username: 'winf_client', password: token
          const client = mqttService.connect(BROKER_URL, {
            clientId: `winf_web_${user.uid}_${Math.random().toString(16).slice(2, 10)}`,
            username: user.uid, // Exemplo de integração auth
            password: token,    // O broker validaria este JWT Token
            will: {
              topic: `winf/users/${user.uid}/status`,
              payload: Buffer.from('OFFLINE'),
              qos: 1,
              retain: true
            }
          });

          client.on('connect', () => {
            setConnectionStatus(true);
            setError(null);
            
            // Publicar status ONLINE (com retenção)
            mqttService.publish(`winf/users/${user.uid}/status`, 'ONLINE', { qos: 1, retain: true });

            // Inscrever nos tópicos dos dispositivos vinculados a este usuário
            // O ideal seria buscar na API a lista de devices permitidos e assinar
            client.subscribe('winf/devices/+/telemetry');
            client.subscribe('winf/devices/+/status');
          });

          client.on('message', (topic, message) => {
            try {
              const payload = JSON.parse(message.toString());
              const topicParts = topic.split('/');
              const deviceId = topicParts[2];
              const topicType = topicParts[3]; // telemetry ou status

              if (topicType === 'telemetry') {
                updateDeviceTelemetry(deviceId, payload);
              } else if (topicType === 'status') {
                updateDeviceStatus(deviceId, payload.status);
              }
            } catch (e) {
              console.warn('[MQTT] Error parsing message from topic:', topic, e);
            }
          });

        } catch (err: any) {
          setError(err.message);
        }
      } else {
        // Desconecta ao fazer logout
        mqttService.disconnect();
        setConnectionStatus(false);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [setConnectionStatus, updateDeviceTelemetry, updateDeviceStatus]);

  // Função genérica para enviar comandos aos dispositivos
  const sendCommand = (deviceId: string, commandType: string, payload: any) => {
    const topic = `winf/devices/${deviceId}/command/${commandType}`;
    mqttService.publish(topic, payload, { qos: 1 }); // QoS 1 garante a entrega
  };

  return { sendCommand, error };
};
