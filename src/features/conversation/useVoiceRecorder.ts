import {
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_DURATION_MS = 600;
// Metering reports decibels, roughly -160 (silence) to 0 (loud). Speech sits near -40..-10.
const FLOOR_DB = -55;

const RECORDING_OPTIONS = { ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true };

export type VoiceResult = { uri: string; durationMs: number };

export function useVoiceRecorder() {
  const recorder = useAudioRecorder(RECORDING_OPTIONS);
  const recorderState = useAudioRecorderState(recorder, 70);
  const startedAt = useRef(0);
  const [recording, setRecording] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!recording) return undefined;
    const timer = setInterval(() => setElapsedMs(Date.now() - startedAt.current), 200);
    return () => clearInterval(timer);
  }, [recording]);

  // Turn the microphone loudness into a 0..1 level for the waveform.
  useEffect(() => {
    if (!recording) {
      setLevel(0);
      return;
    }
    const db = recorderState.metering;
    const next =
      typeof db === 'number'
        ? Math.min(1, Math.max(0, (db - FLOOR_DB) / -FLOOR_DB))
        : 0.15 + Math.random() * 0.5; // metering not reported on this device: gentle motion
    setLevel(next);
  }, [recording, recorderState]);

  const start = useCallback(async () => {
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    startedAt.current = Date.now();
    setElapsedMs(0);
    setRecording(true);
  }, [recorder]);

  // Stops recording. Returns null if the clip is too short to keep.
  const stop = useCallback(async (): Promise<VoiceResult | null> => {
    const durationMs = Date.now() - startedAt.current;
    setRecording(false);
    try {
      await recorder.stop();
    } finally {
      await setAudioModeAsync({ allowsRecording: false });
    }
    const uri = recorder.uri;
    return uri && durationMs >= MIN_DURATION_MS ? { uri, durationMs } : null;
  }, [recorder]);

  return { recording, elapsedMs, level, start, stop };
}
