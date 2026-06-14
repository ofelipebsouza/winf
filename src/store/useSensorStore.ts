import { create } from 'zustand';

export interface SensorData {
  device_id: string;
  temperature: number;
  film_opacity: number;
  uv_index: number;
  status: 'ONLINE' | 'OFFLINE' | 'ERROR';
  last_update: string;
}

interface SensorStore {
  sensors: Record<string, SensorData>;
  isConnected: boolean;
  setConnectionStatus: (status: boolean) => void;
  updateSensor: (deviceId: string, data: Partial<SensorData>) => void;
  batchUpdateSensors: (sensorsData: SensorData[]) => void;
}

export const useSensorStore = create<SensorStore>((set) => ({
  sensors: {},
  isConnected: false,
  setConnectionStatus: (status) => set({ isConnected: status }),
  
  updateSensor: (deviceId, data) => set((state) => ({
    sensors: {
      ...state.sensors,
      [deviceId]: {
        ...(state.sensors[deviceId] || {}),
        ...data,
      } as SensorData,
    }
  })),

  batchUpdateSensors: (sensorsData) => set((state) => {
    const updatedSensors = { ...state.sensors };
    sensorsData.forEach(sensor => {
      updatedSensors[sensor.device_id] = sensor;
    });
    return { sensors: updatedSensors };
  }),
}));
