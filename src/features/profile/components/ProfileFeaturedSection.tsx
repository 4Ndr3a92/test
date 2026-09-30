import React from 'react';

import { TrailGrid } from '@/shared/components/TrailGrid';
import { Trail } from '@/shared/type/trail';
import { CardTrail } from '@/features/home/api/homeApi';

interface Props {
  trails: CardTrail[];
  onPressTrail: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  favoriteIds?: string[];
}

export const ProfileFeaturedSection: React.FC<Props> = (props) => (
  <TrailGrid {...props} horizontal = {false} width={0.9} horizontalPadding={5} />
);