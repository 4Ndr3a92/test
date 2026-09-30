import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MarkerView } from '@rnmapbox/maps';
import Svg, { Circle, ClipPath, Defs, ForeignObject, Image, Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
  imageUrl?: string;
  icon?: React.ReactNode;
  animated?: boolean;
  visible?: boolean;
  latitude: number;
  longitude: number;
  onPress: () => void;
};

export const CustomMarker : React.FC<Props> = ({
  latitude,
  longitude,
  size = 44,
  color = '#8a9991',
  imageUrl,
  icon,
  animated = false,
  visible = true,
  onPress,
}) => {
  const half = size / 2;
  const border = 2;
  const pinHeight = size / 2;
  const pinWidth = size / 3;
  const radius = half - border;

  const pulseScale = useRef(new Animated.Value(1)).current;
  const visibilityOpacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const visibilityScale = useRef(new Animated.Value(visible ? 1 : 0.3)).current;

  // Animazione Pulsante
  useEffect(() => {
    if (!animated) {
      pulseScale.setValue(1);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.08,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
      pulseScale.setValue(1);
    };
  }, [animated, pulseScale]);

  // Animazione Fluidità Comparsa/Scomparsa basata sullo Zoom
  useEffect(() => {
    Animated.parallel([
      Animated.timing(visibilityOpacity, {
        toValue: visible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(visibilityScale, {
        toValue: visible ? 1 : 0.3,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, visibilityOpacity, visibilityScale]);

  const markerId = `custom-marker-${latitude}-${longitude}`;

  return (
    <MarkerView
      id={markerId}
      coordinate={[longitude, latitude]}
      allowOverlap={true}
      anchor={{ x: 0.5, y: 1.0 }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={!visible}
      >
        <Animated.View
          style={[
            styles.container,
            {
              opacity: visibilityOpacity,
              transform: [
                { scale: Animated.multiply(pulseScale, visibilityScale) },
              ],
            },
          ]}
          pointerEvents={visible ? 'auto' : 'none'}
        >
          <Svg
            width={size}
            height={size + pinHeight}
            viewBox={`0 0 ${size} ${size + pinHeight}`}
          >
            <Defs>
              <ClipPath id={`imgClip-${markerId}`}>
                <Circle cx={half} cy={half} r={radius} />
              </ClipPath>
            </Defs>

            {/* Punta */}
            <Path
              d={`M ${half - pinWidth / 2} ${size - 4} Q ${half} ${size + pinHeight} ${half + pinWidth / 2} ${size - 4}Z`}
              fill={color}
            />
            {/* Cerchio esterno */}
            <Circle
              cx={half}
              cy={half}
              r={half - border}
              fill="none"
              stroke={color}
              strokeWidth={2}
            />
            {imageUrl ? (
              <Image
                href={{ uri: imageUrl }}
                x={border}
                y={border}
                width={radius * 2}
                height={radius * 2}
                clipPath={`url(#imgClip-${markerId})`}
                preserveAspectRatio="xMidYMid slice"
              />
            ) : (
              <ForeignObject x={border} y={border} width={radius * 2} height={radius * 2}>
                <View
                  style={{
                    position: 'absolute',
                    top: border,
                    left: border,
                    width: size - 8,
                    height: size - 8,
                    borderRadius: (size - 8) / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  }}
                >
                  {icon}
                </View>
              </ForeignObject>
            )}
          </Svg>
        </Animated.View>
      </TouchableOpacity>
    </MarkerView>
  );
};



const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8,
  },
});