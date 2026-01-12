import { FC, useEffect } from "react";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

import { IMusic } from "../../interface/music.interface";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { playMusic, pauseMusic } from "../../store/slice/player.slice";

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const MusicBlock: FC<{ music: IMusic }> = ({ music }) => {
  const { current, isPlaying } = useAppSelector(state => state.player);
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.settings.theme);

  const player = useAudioPlayer(music.music);
  const status = useAudioPlayerStatus(player);

  const isActive = current?.music === music.music;
  const isDark = theme === "dark";

  const colors = {
    background: isDark ? "#16181D" : "#FFFFFF",
    textPrimary: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "#A1A1AA" : "#666666",
    accent: "#7C7CFF",
    sliderInactive: isDark ? "#2A2D36" : "#DDDDDD",
    overlay: isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.35)",
  };

  useEffect(() => {
    if (!isActive) {
      player.pause();
      player.seekTo(0);
    }
  }, [isActive]);

  const onPlayPress = () => {
    if (!isActive) {
      dispatch(playMusic(music));
      player.play();
    } else {
      if (isPlaying) {
        dispatch(pauseMusic());
        player.pause();
      } else {
        dispatch(playMusic(music));
        player.play();
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Cover */}
      <TouchableOpacity style={styles.coverWrap} onPress={onPlayPress}>
        <Image source={music.image} style={styles.cover} />

        {isActive && (
          <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
            <Text style={styles.icon}>
              {isPlaying ? (
                <Image source={require("../../assets/pause.png")} />
              ) : (
                <Image source={require("../../assets/play.png")} />
              )}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Info */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {music.name}
        </Text>
        <Text style={[styles.artist, { color: colors.textSecondary }]}>
          {music.artist}
        </Text>

        <View style={{ marginTop: 6 }}>
          <Slider
            minimumValue={0}
            maximumValue={status.duration || 1}
            value={status.currentTime}
            disabled={!isActive}
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor={colors.sliderInactive}
            thumbTintColor={colors.accent}
            onSlidingStart={() => player.pause()}
            onSlidingComplete={(value) => {
              player.seekTo(value);
              if (isActive && isPlaying) player.play();
            }}
          />

          <View style={styles.timeRow}>
            <Text style={{ color: colors.textSecondary }}>
              {formatTime(status.currentTime)}
            </Text>
            <Text style={{ color: colors.textSecondary }}>
              {formatTime(status.duration || 0)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
  },

  coverWrap: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: "hidden",
  },

  cover: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 32,
    color: "#fff",
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontWeight: "600",
  },

  artist: {
    opacity: 0.6,
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});


export default MusicBlock;

