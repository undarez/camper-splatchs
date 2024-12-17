"use client";

import NavigationButton from "./NavigationButton";

interface NavigationButtonWrapperProps {
  lat: number;
  lng: number;
  address: string;
}

export default function NavigationButtonWrapper(
  props: NavigationButtonWrapperProps
) {
  return <NavigationButton {...props} />;
}
