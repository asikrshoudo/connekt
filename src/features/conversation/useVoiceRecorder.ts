import { RecordingPresets, setAudioModeAsync, useAudioRecorder } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_DURATION_MS = 600;

export type VoiceResult = { uri: string; durationMs: number };

export function useVoiceRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const startedAt = useRef(0);
  const [recording, setRecording] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (!recording) return undefined;
    const timer = setInterval(() => setElapsedMs(Date.now() - startedAt.current), 200);
    return () => clearInterval(timer);
  }, [recording]);

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

  return { recording, elapsedMs, start, stop };
}
