'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PERSON_IMAGE_FALLBACK } from '@/services/personImageUrl';
import './PersonImage.css';

interface PersonImageProps {
  src: string;
  alt: string;
  size: number;
  className?: string;
  priority?: boolean;
}

function PersonImage({
  src,
  alt,
  size,
  className,
  priority = false,
}: PersonImageProps) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={size}
      height={size}
      sizes={`${size}px`}
      priority={priority}
      className={['person-image', className].filter(Boolean).join(' ')}
      onError={() => {
        if (imageSrc !== PERSON_IMAGE_FALLBACK) {
          setImageSrc(PERSON_IMAGE_FALLBACK);
        }
      }}
    />
  );
}

export default PersonImage;
