import { useEffect, useState } from 'react';
import { socketService } from '../services/socket';
import { useSensorStore, SensorData } from '../store/useSensorStore';
import { auth } from '../lib/firebase'; // Assuming Firebase Auth is init here
import { onAuthStateChanged } from 'firebase/auth';

export const useSocket = () => {
  const { setConnectionStatus, updateSensor } = useSensorStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Escuta estado de autenticação para conectar com Token
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const socket = socketService.connect(token);

          socket.on('connect', () => {
            setConnectionStatus(true);
            setError(null);
          });

          socket.on('disconnect', () => {
            setConnectionStatus(false);
          });

          // Listener de dados de sensores em tempo real
          socket.on('sensor:update', (data: { device_id: string; payload: Partial<SensorData> }) => {
            updateSensor(data.device_id, data.payload);
          });
          
          socket.on('notification:new', (data: { title: string; message: string }) => {
            console.log('Realtime Notification:', data.title, data.message);
          });

          socket.on('error', (err: any) => {
            setError(err.message || 'Um erro ocorreu no WebSocket');
          });

        } catch (err: any) {
          setError(err.message);
        }
      } else {
        // Se deslogou, desconecta
        socketService.disconnect();
        setConnectionStatus(false);
      }
    });

    return () => {
      unsubscribeAuth();
      // Em produção, você pode decidir se desconecta na desmontagem ou mantém vivo.
      // socketService.disconnect(); 
    };
  }, [setConnectionStatus, updateSensor]);

  // Função para enviar comandos
  const sendCommand = (deviceId: string, command: string, payload: any) => {
    const socket = socketService.getSocket();
    if (socket && socket.connected) {
      socket.emit('device:command', { deviceId, command, payload });
    } else {
      console.error('Socket não está conectado. Não é possível enviar o comando.');
    }
  };

  return { sendCommand, error };
};
