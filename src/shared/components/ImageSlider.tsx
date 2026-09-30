import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View, FlatList, TouchableOpacity,
  StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj[ayfRayfQfQM{M|azazj[azfQj[ayfjayj[a|j[ayj[';
const AUTOPLAY_INTERVAL_MS        = 3000;
const RESUME_AFTER_INTERACTION_MS = 5000;

// ─── Tipi ──────────────────────────────────────────────────────────────────

export interface SlideItem {
  id: string;
  url: string;
}

interface Action {
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon?: keyof typeof Ionicons.glyphMap;
  isActive?: boolean;
  activeColor?: string;
  color?: string;
  onPress: () => void;
  position: 'left' | 'right';
}

interface Props {
  slides: SlideItem[];

  /** Altezza dello slider. Default: 380 */
  height?: number;

  /** Larghezza dello slider. Default: larghezza schermo */
  width?: number;

  /** Autoplay abilitato. Default: true */
  autoplay?: boolean;

  /** Mostra i dots di navigazione. Default: true */
  showDots?: boolean;

  /** Inset superiore per posizionare i bottoni sotto la status bar */
  topInset?: number;

  /** Azioni come pulsanti flottanti sull'immagine (es. back, favorito) */
  actions?: Action[];
}

// ─── Componente ────────────────────────────────────────────────────────────

export const ImageSlider: React.FC<Props> = ({
  slides,
  height = 380,
  width = SCREEN_WIDTH,
  autoplay = true,
  showDots = true,
  topInset = 0,
  actions = [],
}) => {
  const [activeIndex, setActiveIndex]   = useState(0);
  const listRef                          = useRef<FlatList>(null);
  const autoplayTimer                    = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimer                      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUserInteracting                = useRef(false);

  // ── Autoplay ──────────────────────────────────────────────────────────────
  const startAutoplay = useCallback(() => {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    if (!autoplay || slides.length <= 1) return;

    autoplayTimer.current = setInterval(() => {
      if (isUserInteracting.current) return;
      setActiveIndex((prev) => {
        const next = (prev + 1) % slides.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, AUTOPLAY_INTERVAL_MS);
  }, [autoplay, slides.length]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      if (resumeTimer.current)   clearTimeout(resumeTimer.current);
    };
  }, [startAutoplay]);

  // ── Handlers scroll ───────────────────────────────────────────────────────
  const handleScrollBeginDrag = () => {
    isUserInteracting.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };

  const handleScrollEndDrag = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      isUserInteracting.current = false;
    }, RESUME_AFTER_INTERACTION_MS);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleDotPress = (index: number) => {
    isUserInteracting.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    listRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
    resumeTimer.current = setTimeout(() => {
      isUserInteracting.current = false;
    }, RESUME_AFTER_INTERACTION_MS);
  };

  // ── Posizione bottoni (rispetta safe area) ────────────────────────────────
  const buttonTop = topInset + spacing.sm;

  const leftActions  = actions.filter((a) => a.position === 'left');
  const rightActions = actions.filter((a) => a.position === 'right');

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { height, width }]}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        renderItem={({ item }) => (
          <Image
            source={item.url}
            style={{ width, height }}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={150}
            cachePolicy="disk"
          />
        )}
      />

      {/* ── Overlay scuro in basso per leggibilità dei dots ── */}
      {showDots && slides.length > 1 && (
        <View style={styles.dotsOverlay}>
          <View style={styles.dotsRow}>
            {slides.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => handleDotPress(i)} hitSlop={8}>
                <View style={[styles.dot, i === activeIndex && styles.dotActive]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ── Azioni sinistra ── */}
      {leftActions.length > 0 && (
        <View style={[styles.actionsColumn, styles.actionsLeft, { top: buttonTop }]}>
          {leftActions.map((action, i) => (
            <ActionButton key={i} action={action} />
          ))}
        </View>
      )}

      {/* ── Azioni destra ── */}
      {rightActions.length > 0 && (
        <View style={[styles.actionsColumn, styles.actionsRight, { top: buttonTop }]}>
          {rightActions.map((action, i) => (
            <ActionButton key={i} action={action} />
          ))}
        </View>
      )}
    </View>
  );
};

// ─── ActionButton ──────────────────────────────────────────────────────────

const ActionButton: React.FC<{ action: Action }> = ({ action }) => {
  const icon  = action.isActive && action.activeIcon ? action.activeIcon : action.icon;
  const color = action.isActive && action.activeColor ? action.activeColor : (action.color ?? 'black');

  return (
    <TouchableOpacity style={styles.actionBtn} onPress={action.onPress}>
      <Ionicons name={icon} size={22} color={color} />
    </TouchableOpacity>
  );
};

// ─── Stili ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  dotsOverlay: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    paddingVertical: spacing.md,
    alignItems:      'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap:           6,
  },
  dot: {
    width:           7,
    height:          7,
    borderRadius:    4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    width:           20,
    backgroundColor: '#FFFFFF',
  },
  actionsColumn: {
    position: 'absolute',
    gap:      spacing.sm,
  },
  actionsLeft:  { left:  spacing.lg },
  actionsRight: { right: spacing.lg },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});