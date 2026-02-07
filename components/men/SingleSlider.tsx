import React from 'react';
import SingleSliderJSX from '@/components/SingleSlider';

export type SingleSliderProps = {
  slug_name: string;
  title: string;
  price_filter?: number;
  discountPercentage?: number;
  cat_slug_name?: string;
};

const TypedSingleSliderJSX =
  SingleSliderJSX as React.ComponentType<SingleSliderProps>;

const SingleSlider: React.FC<SingleSliderProps> = (props) => {
  return <TypedSingleSliderJSX {...props} />;
};

export default SingleSlider;
