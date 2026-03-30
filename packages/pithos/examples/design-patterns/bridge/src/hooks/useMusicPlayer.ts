import { useState, useEffect, useCallback, useRef } from "react";
import { loadAndPlay, stopPlayback, pausePlayback, resumePlayback, setVolume, isPlaying, getDuration } from "@/lib/audio";
import { setCoverImage } from "@/lib/visualizers/sun";
import { SOURCES } from "@/data/tracks";
import type { SourceKey, VisualizerKey } from "@/lib/types";

export function useMusicPlayer() {
  const [sourceKey, setSourceKey] = useState<SourceKey>("track1");
  const [vizKey, setVizKey] = useState<VisualizerKey>("bars");
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const loadIdRef = useRef(0);

  const sourceMeta = SOURCES.find((s) => s.key === sourceKey);
  const accent = sourceMeta?.color ?? "#f43f5e";

  const handleSourceChange = useCallback(async (key: SourceKey) => {
    setSourceKey(key);
    const meta = SOURCES.find((s) => s.key === key);
    if (!meta) return;
    setCoverImage(`${import.meta.env.BASE_URL}${meta.cover}`);
    stopPlayback();
    setLoading(true);
    const id = ++loadIdRef.current;
    await loadAndPlay(`${import.meta.env.BASE_URL}${meta.filename}`);
    if (id !== loadIdRef.current) return; // superseded by a newer call
    setVolume(volume);
    setLoading(false);
    setPlaying(true);
  }, [volume]);

  const handlePlayPause = useCallback(async () => {
    if (playing) {
      pausePlayback();
      setPlaying(false);
    } else if (isPlaying() || getDuration() > 0) {
      resumePlayback();
      setPlaying(true);
    } else {
      const meta = SOURCES.find((s) => s.key === sourceKey);
      if (!meta) return;
      setLoading(true);
      const id = ++loadIdRef.current;
      await loadAndPlay(`${import.meta.env.BASE_URL}${meta.filename}`);
      if (id !== loadIdRef.current) return;
      setVolume(volume);
      setLoading(false);
      setPlaying(true);
    }
  }, [playing, sourceKey, volume]);

  const handleVolume = useCallback((v: number) => {
    setVolumeState(v);
    setVolume(v);
  }, []);

  useEffect(() => {
    const meta = SOURCES.find((s) => s.key === sourceKey);
    if (meta) setCoverImage(`${import.meta.env.BASE_URL}${meta.cover}`);
  }, [sourceKey]);

  useEffect(() => {
    return () => stopPlayback();
  }, []);

  return {
    sourceKey, vizKey, setVizKey, playing, loading, volume, accent,
    handleSourceChange, handlePlayPause, handleVolume,
  };
}
