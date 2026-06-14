import { create } from 'zustand';

export interface DeviceTelemetry {
  temperature: number;
  film_opacity: number;
  uv_index: number;
  energy_consumption: number;
}

export interface DeviceState {
  device_id: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';
  telemetry: Partial<DeviceTelemetry>;
  last_update: string;
}

interface MqttStore {
  devices: Record<string, DeviceState>;
  isConnected: boolean;
  setConnectionStatus: (status: boolean) => void;
  updateDeviceTelemetry: (deviceId: string, telemetry: Partial<DeviceTelemetry>) => void;
  updateDeviceStatus: (deviceId: string, status: DeviceState['status']) => void;
}

export const useMqttStore = create<MqttStore>((set) => ({
  devices: {},
  isConnected: false,
  
  setConnectionStatus: (status) => set({ isConnected: status }),

  updateDeviceTelemetry: (deviceId, telemetry) => set((state) => ({
    devices: {
      ...state.devices,
      [deviceId]: {
        ...(state.devices[deviceId] || { device_id: deviceId, status: 'OFFLINE', telemetry: {} }),
        telemetry: {
          ...state.devices[deviceId]?.telemetry,
          ...telemetry
        },
        last_update: new Date().toISOString(),
      }
    }
  })),

  updateDeviceStatus: (deviceId, status) => set((state) => ({
    devices: {
      ...state.devices,
      [deviceId]: {
        ...(state.devices[deviceId] || { device_id: deviceId, telemetry: {} }),
        status,
        last_update: new Date().toISOString(),
      }
    }
  })),
}));
